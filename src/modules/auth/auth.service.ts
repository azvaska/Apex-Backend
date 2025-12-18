import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { FirebaseProvider } from "@alpha018/nestjs-firebase-auth";
import { PrismaService } from "../../common/prisma.service";
import { SignUpDto } from "./dto/signup.dto";
import { UpdateFcmTokenDto } from "./dto/update-fcm-token.dto";

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

      return {
        user: dbUser,
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

  /**
   * Update the FCM token for a user
   * @param firebaseUid - The Firebase UID of the user
   * @param dto - The DTO containing the new FCM token
   * @returns The updated user data
   */
  async updateFcmToken(firebaseUid: string, dto: UpdateFcmTokenDto) {
    try {
      const user = await this.prisma.user.update({
        where: { firebaseUid },
        data: {
          fcmToken: dto.fcmToken,
          fcmTokenUpdatedAt: new Date(),
        },
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          name: true,
          surname: true,
          profileImage: true,
          fcmToken: true,
          fcmTokenUpdatedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { user };
    } catch (e: any) {
      if (e?.code === "P2025") {
        throw new NotFoundException("User not found");
      }
      console.log(e);
      throw new InternalServerErrorException("Failed to update FCM token");
    }
  }

  /**
   * Clear the FCM token for a user (e.g., on logout)
   * @param firebaseUid - The Firebase UID of the user
   * @returns The updated user data
   */
  async clearFcmToken(firebaseUid: string) {
    try {
      const user = await this.prisma.user.update({
        where: { firebaseUid },
        data: {
          fcmToken: null,
          fcmTokenUpdatedAt: new Date(),
        },
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          name: true,
          surname: true,
          profileImage: true,
          fcmToken: true,
          fcmTokenUpdatedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { user };
    } catch (e: any) {
      if (e?.code === "P2025") {
        throw new NotFoundException("User not found");
      }
      console.log(e);
      throw new InternalServerErrorException("Failed to clear FCM token");
    }
  }
}

// curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBMl2emp1zaHJQbc7KPMuAX8Qr75-3cZFU" \
//   -H "Content-Type: application/json" \
//   -d '{"email":"a@a5.com","password":"123456","returnSecureToken":true}'
