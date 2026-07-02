// authLogic.js
let supabaseClient = null;

export function setSupabase(client) {
    supabaseClient = client;
}

// 로그인 함수
export async function loginUser(id, pw) {
    // 1. signInWithPassword 대신 .from().select()를 사용합니다.
    const { data, error } = await supabaseClient
        .from('users') // 직접 만든 테이블 이름
        .select('*')
        .eq('login_id', id)  // DB의 컬럼명에 맞춰 수정
        .eq('password', pw)  // DB의 컬럼명에 맞춰 수정
        .single();           // 단일 레코드 반환

    if (error) {
        throw new Error('ID 또는 비밀번호가 일치하지 않습니다.');
    }
    
    if (data) {
        // 성공 시 로컬 스토리지에 유저 ID 저장
        localStorage.setItem('currentUser', data.id);
        return data;
    }
}
// 포인트 조회 함수
export async function getUserPoints(userId) {
    const { data, error } = await supabaseClient
        .from('users')
        .select('point')
        .eq('id', userId) // 'user_id'가 아니라 'id'여야 합니다.
        .single();
        
    if (error) {
        console.error("포인트 조회 오류:", error);
        return 0;
    }
    return data.point;
}

// 포인트 업데이트 함수
export async function updatePoints(userId, amountChange) {
    // 1. 현재 포인트 조회
    const currentPoints = await getUserPoints(userId);
    // 2. 새로운 포인트 계산
    const newPoints = currentPoints + amountChange;
    // 3. 업데이트 수행 ('user_id' -> 'id'로 수정)
    const { data, error } = await supabaseClient
        .from('users')
        .update({ point: newPoints })
        .eq('id', userId); 
        
    if (error) {
        console.error("포인트 업데이트 오류:", error);
        return false;
    }
    return true;
}
