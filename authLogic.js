// authLogic.js
let supabaseClient = null;

export function setSupabase(client) {
    supabaseClient = client;
}
// authLogic.js
export async function loginUser(id, pw) {
    // .signInWithPassword 대신 .from().select()를 사용해야 합니다.
    const { data, error } = await supabaseClient
        .from('users') // 직접 만든 테이블 이름
        .select('*')
        .eq('login_id', id)  // DB의 ID 컬럼명에 맞춰 수정하세요
        .eq('password', pw)  // DB의 비밀번호 컬럼명에 맞춰 수정하세요
        .single();

    if (error || !data) {
        throw new Error('ID 또는 비밀번호가 일치하지 않습니다.');
    }
    
    // 성공 시 로컬 스토리지에 유저 ID 저장 (세션 유지)
    localStorage.setItem('currentUser', data.id);
    return data;
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
