// authLogic.js
export const login = async (supabase, id, pw) => {
    // Supabase 로그인 인증 로직
    const { data, error } = await supabase.auth.signInWithPassword({ email: id, password: pw });
    if (error) {
        alert("로그인 실패: " + error.message);
        return false;
    }
    return true;
};
