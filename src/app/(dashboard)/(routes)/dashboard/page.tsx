import { UserButton } from "@clerk/nextjs";

const dashboardPage = () => {
  return (
    <div>
      <h1>Dashboard Page</h1>
      <UserButton />
    </div>
  );
};

export default dashboardPage;