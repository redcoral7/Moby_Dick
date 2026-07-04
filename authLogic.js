// authLogic.js
let supabaseClient = null;

export function setSupabase(client) {
    supabaseClient = client;
}

export async function loginUser(id, pw) {
    // Supabase의 내장 Auth 대신 직접 만든 테이블을 조회
    const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('login_id', id) // 테이블 컬럼명이 login_id라고 가정
        .eq('password', pw) // 테이블 컬럼명이 password라고 가정
        .single();

    if (error || !data) {
        throw new Error('ID 또는 비밀번호가 일치하지 않습니다.');
    }
    
    // 성공 시 로컬 스토리지에 유저 정보 저장 (화면 유지용)
    localStorage.setItem('currentUser', JSON.stringify(data));
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
