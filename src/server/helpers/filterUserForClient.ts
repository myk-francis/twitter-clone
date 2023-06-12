import type { User } from "@clerk/nextjs/dist/types/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl,
    firstName: user.firstName,
  };
};

export default filterUserForClient;
