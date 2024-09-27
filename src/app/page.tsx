import { fetchGetWithSector } from "@/api/apiService";
import UserDashboard from "@/components/userDashboard";

const Home = async () => {
  const users = await fetchGetWithSector("personal");

  return (
    <div>
      <UserDashboard initialUsers={users} />
    </div>
  );
};

export default Home;
