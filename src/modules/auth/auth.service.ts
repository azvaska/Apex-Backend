import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { FirebaseProvider } from "@alpha018/nestjs-firebase-auth";
import { PrismaService } from "../../common/prisma.service";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseApp: FirebaseProvider,
    private readonly prisma: PrismaService,
  ) {}

  async signup(dto: SignUpDto) {
    let firebaseUid: string | null = null;

    try {
      // 1) Create Firebase Auth user
      // Note: profileImage is now base64, so we don't set photoURL in Firebase Auth
      const fbUser = await this.firebaseApp.auth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: `${dto.name} ${dto.surname}`.trim(),
      });

      firebaseUid = fbUser.uid;

      // 2) Create backend DB user linked to Firebase UID
      const dbUser = await this.prisma.user.create({
        data: {
          firebaseUid: fbUser.uid,
          email: dto.email,
          name: dto.name,
          surname: dto.surname,
          profileImage: dto.profileImage ?? null,
        },
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          name: true,
          surname: true,
          profileImage: true,
          createdAt: true,
        },
      });

      // Optional: return a custom token for immediate login via signInWithCustomToken
      const customToken = await this.firebaseApp.auth.createCustomToken(
        fbUser.uid,
      );

      return {
        user: dbUser,
        customToken,
      };
    } catch (e: any) {
      // Best-effort rollback if DB write fails after Firebase user creation
      if (firebaseUid) {
        try {
          await this.firebaseApp.auth().deleteUser(firebaseUid);
        } catch {
          // swallow rollback failures; log in real code
        }
      }

      if (e?.code === "auth/email-already-exists") {
        throw new ConflictException("Email already registered");
      }

      // Prisma unique constraint (firebaseUid/email) can land here too
      if (e?.code === "P2002") {
        throw new ConflictException("User already exists");
      }
      console.log(e);

      throw new InternalServerErrorException("Signup failed");
    }
  }
}
