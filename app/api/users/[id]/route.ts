import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/libs/db";

interface Params {
  id: string;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(params.id).lean();

    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
