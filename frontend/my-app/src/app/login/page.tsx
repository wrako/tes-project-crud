// файл: src/app/login/page.tsx
"use client"; // обязательно, если внутри используются хуки

import LoginForm from "../../components/login/LoginForm"; 
// путь зависит от того, где лежит компонент. Если LoginForm.tsx лежит в `components/`, 
// а вы внутри `src/app/login/page.tsx`, то фактически нужно выйти из `src/app/login` и 
// зайти в `components`, то есть: ../../components/LoginForm, но учитывая, что у вас src/—
// например, "../../../" может понадобиться. Скорее всего достаточно:
// import LoginForm from "@/components/LoginForm" 
// если настроен алиас "@/*" в tsconfig и next.config.js.

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
