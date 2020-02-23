/** 
 * api接口统一管理
 */
import { get, post } from './http';

// Site
export const SiteConfig = g => get('/site/config', g);

// Auth
export const githubBack = g => get('/auth/github/v2/callback', g);
export const githubUnbind = p => post('/auth/github/v2/unbind', p);
export const gitlabBack = g => get('/auth/gitlab/callback', g);
export const gitlabUnbind = p => post('/auth/gitlab/unbind', p);

// User
export const Login = p => post('/user/login', p);
export const Register = p => post('/user/register', p);
export const GetProfile = g => get('/user/profile', g);
export const GetProfileID = g => get('/user/profile/id', g);
export const ChangeProfile = p => post('/user/profile/change', p);
export const RePass = p => post('/user/change_pass', p);
export const VerifyEmail = p => post('/user/verify/email', p);
export const ResendVerifyEmail = p => post('/user/email/verify_email', p);
export const SendReEmailCode = p => post('/user/email/change_email', p);
export const ReEmail = p => post('/user/verify/change_email', p);
export const SendRePassCode = p => post('/user/email/change_password', p);
export const RePassVerify = p => post('/user/verify/change_password', p);

// Msg
export const StateMsg = g => get('/statemsg/state', g);
export const LoadMsgList = g => get('/statemsg/msg/list', g);
export const LoadMsg = g => get('/statemsg/msg', g);
export const ReadMsg = g => get('/statemsg/read_msg', g);
export const RemoveMsg = p => post('/statemsg/msg/remove', p);

// Article
export const AddArticle = p => post('/user/Add_Article', p);