interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 dark:bg-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Olá, {userName}!
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
        Acompanhe seus pontos e recompensas
      </p>
    </div>
  );
}


