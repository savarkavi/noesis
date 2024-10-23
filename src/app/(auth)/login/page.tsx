import BorderContainer from "@/components/BorderContainer";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentSession } from "@/lib/session";
import Image from "next/image";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { user } = await getCurrentSession();

  if (user) redirect("/home");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black px-2 py-8">
      <BorderContainer>
        <LoginForm />
        <div className="relative h-[350px] w-[250px] self-start xl:h-[400px] xl:w-[300px]">
          <Image
            src="/greek-philo.png"
            alt="greek philosopher"
            fill
            className="object-cover"
          />
        </div>
      </BorderContainer>
    </div>
  );
};

export default LoginPage;
