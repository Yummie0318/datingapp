import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { customAlphabet } from "nanoid";

const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

// Validation schemas
const FullSchema = z.object({
  signupType: z.literal("full"),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9._-]+$/),
  email: z.string().email(),
  password: z.string().min(8),
  region: z.string().optional().nullable(),
});

const AnonymousSchema = z.object({
  signupType: z.literal("anonymous"),
  nickname: z.string().min(1).max(32).optional(),
  region: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();

    // 🔹 Full Signup
    if (json?.signupType === "full") {
      const data = FullSchema.parse(json);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use." },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(data.password, 12);

      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: passwordHash,
          region: data.region ?? null,
          anonymous: false,
          interests: [],
          languages: [],
          aiUnderstanding: 0,
          lastActive: new Date(),
        },
        select: {
          id: true,
          username: true,
          email: true,
          region: true,
          anonymous: true,
          createdAt: true,
        },
      });

      return NextResponse.json({ user }, { status: 201 });
    }

    // 🔹 Anonymous Signup
    if (json?.signupType === "anonymous") {
      const data = AnonymousSchema.parse(json);

      let anonTag = `anon_${nano()}`;

      // Retry 3 times in case of collision
      for (let i = 0; i < 3; i++) {
        try {
          const user = await prisma.user.create({
            data: {
              anonTag,
              anonymous: true,
              username: data.nickname ?? null,
              region: data.region ?? null,
              interests: [],
              languages: [],
              aiUnderstanding: 0,
              lastActive: new Date(),
            },
            select: {
              id: true,
              anonTag: true,
              username: true,
              anonymous: true,
              createdAt: true,
            },
          });

          return NextResponse.json({ user }, { status: 201 });
        } catch (err: any) {
          if (err.code === "P2002" && err.meta?.target?.includes("anonTag")) {
            anonTag = `anon_${nano()}`;
            continue;
          }
          throw err;
        }
      }

      return NextResponse.json(
        { error: "Failed to create anonymous user after retries." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Unsupported signupType." }, { status: 400 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input.", issues: err.issues },
        { status: 400 }
      );
    }
    console.error("SIGNUP_ERROR:", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
