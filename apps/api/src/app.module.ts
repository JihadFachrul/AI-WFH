import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TaskEvidenceModule } from './modules/task-evidence/task-evidence.module';
import { WorkLogsModule } from './modules/work-logs/work-logs.module';
import { TaskReviewsModule } from './modules/task-reviews/task-reviews.module';
import { WorkSessionsModule } from './modules/work-sessions/work-sessions.module';
import { KpiModule } from './modules/kpi/kpi.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    DepartmentsModule,
    TasksModule,
    TaskEvidenceModule,
    WorkLogsModule,
    TaskReviewsModule,
    WorkSessionsModule,
    KpiModule,
    MeetingsModule,
    CalendarModule,
    NotificationsModule,
    RealtimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
