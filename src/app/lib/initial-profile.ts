import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/drizzle/client";
import { eq } from "drizzle-orm";
import { profile } from "console";

export const initialProfile = async () => {
  const router = useRouter();

  // const { user } = useContext(AuthContext);

  // if (!user) {
  //   // Redirect to the "/auth" route
  //   router.push("/sign-up");
  // }
  const profile = await db.query.profile.findFirst({
    where: (users, { eq }) => eq(users.id, 1),
  });
  console.log(profile);
  if (profile) return profile;
};
