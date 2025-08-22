import Image from "next/image";
import React from "react";

const ContentAccount = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Bem-vindo ao BranlyClub</h1>
      <p className="text-sm text-gray-500">
        Cadastre-se na BranlyClub e comece a transformar clientes em fãs leais.
      </p>
      <Image
        src="/branlyclubLogo.svg"
        alt="BranlyClub"
        width={150}
        height={150}
      />
    </div>
  );
};

export default ContentAccount;
