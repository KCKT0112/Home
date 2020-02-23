import Info from './Info.vue';
import Password from './Password.vue';
import Email from './Email.vue';

export let pages = [
    {
        title: "个人信息",
        component: Info,
        mark: 'info',
    },
    {
        title: "密码管理",
        component: Password,
        mark: 'password'
    },
    {
        title: "邮箱",
        component: Email,
        mark: 'email'
    }
];

export default { pages };
