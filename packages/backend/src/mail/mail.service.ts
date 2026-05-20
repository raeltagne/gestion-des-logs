import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import { sendMailDto } from "./dto/mail.dto";
import { SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { debug } from "console";
@Injectable()
export class MailService{
    constructor(private readonly configService:ConfigService){}

    async emailTransport(){
        const transporter=nodemailer.createTransport({
            host: this.configService.get<string>('HOST_MAIL'),
            port: this.configService.get<number>('PORT_MAIL_SECURE'),
            secure: true,
            auth: {
                user: this.configService.get<string>('USER_MAIL'),
                pass: this.configService.get<string>('PASS_MAIL'),
            },
            connectionTimeout:60000,
            socketTimeout: 60000,
            logger:true,
            debug:true
        } as SMTPTransport.Options)
        return transporter;
    }

    async sendMail(mailDto:sendMailDto){    

        const {recipients,subject,html}=mailDto;

        const transport= await this.emailTransport();

        const options: SendMailOptions={
            from: this.configService.get<string>('USER_MAIL'),
            to: recipients,
            subject: subject,
            html:html,
        };

        try {
            await transport.sendMail(options);
            console.log('Mail sent successfully');
        } catch (error) {
            console.log('Failed to sending mail ',error);
        }
    }

}