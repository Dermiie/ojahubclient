import { useLogout } from '@/api/auth/authApi';

export default function Home() {
  const { mutate: logOut } = useLogout();

  return (
    <div className="flex justify-between">
      Home
      <button
        onClick={() => {
          logOut();
        }}
      >
        logout
      </button>
    </div>
  );
}
