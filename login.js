const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error("Error de Supabase:", error);
        loginError.textContent = error.message;
        return;
    }

    window.location.href = "index.html";
});

// ==========================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ==========================================

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");

if (passwordInput && togglePassword) {

    togglePassword.addEventListener("click", () => {

        const estaOculta = passwordInput.type === "password";

        passwordInput.type = estaOculta ? "text" : "password";

        togglePassword.setAttribute(
            "aria-label",
            estaOculta ? "Ocultar contraseña" : "Mostrar contraseña"
        );

        togglePassword.setAttribute(
            "aria-pressed",
            String(estaOculta)
        );

    });

}