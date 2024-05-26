import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { accpetMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAccpetingMessages: accpetMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update the user",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Updated the user to accept messages",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages");

    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAccpetingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting accepting messages status");

    return Response.json(
      {
        success: false,
        message: "Error in getting accepting messages status",
      },
      { status: 500 }
    );
  }
}
