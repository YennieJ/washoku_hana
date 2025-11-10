import { google } from 'googleapis';

// Google Calendar 클라이언트 초기화
function getCalendarClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  return google.calendar({ version: 'v3', auth });
}

/**
 * Google Calendar에 이벤트 추가 (종일 이벤트)
 * @param {Object} eventData - 이벤트 정보
 * @param {string} eventData.summary - 이벤트 제목
 * @param {string} eventData.description - 이벤트 설명
 * @param {string} eventData.startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} eventData.endDate - 종료 날짜 (YYYY-MM-DD, 다음 날)
 * @param {string} eventData.location - 이벤트 위치 (주소)
 * @returns {Promise<Object>} 생성된 이벤트 정보
 */
export async function addCalendarEvent(eventData: {
  summary: string;
  description: string;
  startDate: string; // YYYY-MM-DD 형식
  endDate: string; // YYYY-MM-DD 형식 (다음 날)
  location: string; // 주소
}) {
  try {
    const calendar = getCalendarClient();

    const event = {
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location, // 주소를 location 필드에 추가 (지도 연동 가능)
      // 종일 이벤트: dateTime 대신 date 사용
      start: {
        date: eventData.startDate,
        timeZone: 'America/Vancouver', // 캐나다 벤쿠버 시간대
      },
      end: {
        date: eventData.endDate,
        timeZone: 'America/Vancouver',
      },
      // 참석자 제거 (참석자 이메일 불필요)
      reminders: {
        useDefault: false,
        overrides: [
          // 종일 이벤트 시작(자정)으로부터 17시간 = 1020분 = 당일 오후 5시
          { method: 'email', minutes: 17 * 60 }, // 당일 오후 5시
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      requestBody: event,
      // 참석자가 없으므로 sendUpdates 제거
    });

    const createdEvent = response.data;
    if (!createdEvent) {
      throw new Error('캘린더 이벤트 생성 응답이 없습니다.');
    }

    return {
      success: true,
      eventId: createdEvent.id || '',
      eventLink: createdEvent.htmlLink || '',
    };
  } catch (error: any) {
    console.error('Calendar event creation error:', error);
    throw new Error(`캘린더 이벤트 생성 실패: ${error.message}`);
  }
}

/**
 * Google Calendar 이벤트 삭제
 * @param {string} eventId - 삭제할 이벤트 ID
 */
export async function deleteCalendarEvent(eventId: string) {
  try {
    const calendar = getCalendarClient();

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId: eventId,
      sendUpdates: 'all',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Calendar event deletion error:', error);
    throw new Error(`캘린더 이벤트 삭제 실패: ${error.message}`);
  }
}

/**
 * Google Calendar 이벤트 수정
 * @param {string} eventId - 수정할 이벤트 ID
 * @param {Object} updates - 수정할 정보
 */
export async function updateCalendarEvent(
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    startDateTime?: string;
    endDateTime?: string;
  }
) {
  try {
    const calendar = getCalendarClient();

    // 기존 이벤트 가져오기
    const existingEventResponse = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId: eventId,
    });

    const existingEvent = existingEventResponse.data;
    if (!existingEvent) {
      throw new Error('기존 이벤트를 찾을 수 없습니다.');
    }

    // 업데이트할 필드 병합
    const updatedEvent = {
      ...existingEvent,
      summary: updates.summary || existingEvent.summary,
      description: updates.description || existingEvent.description,
      start: updates.startDateTime
        ? {
            date: updates.startDateTime.split('T')[0], // 종일 이벤트로 변환
            timeZone: 'America/Vancouver',
          }
        : existingEvent.start,
      end: updates.endDateTime
        ? {
            date: updates.endDateTime.split('T')[0],
            timeZone: 'America/Vancouver',
          }
        : existingEvent.end,
    };

    const response = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId: eventId,
      requestBody: updatedEvent,
      sendUpdates: 'all',
    });

    const updatedEventData = response.data;
    if (!updatedEventData) {
      throw new Error('이벤트 업데이트 응답이 없습니다.');
    }

    return {
      success: true,
      eventId: updatedEventData.id || eventId,
    };
  } catch (error: any) {
    console.error('Calendar event update error:', error);
    throw new Error(`캘린더 이벤트 수정 실패: ${error.message}`);
  }
}
