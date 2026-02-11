
export interface ProjectLink {
    label: string;
    url: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    period: string;
    githubUrl?: string | string[]; // Allow multiple GitHub URLs
    demoUrl?: string; // Optional (legacy)
    links?: ProjectLink[]; // For multiple links
    imageUrl?: string; // Optional for card preview if needed
}


export const projects: Project[] = [
    {
        id: '1',
        title: 'Asset Manager',

        description: 'Next.jsを使用した資産管理アプリケーション。資産の記録、カテゴリー分け、総資産の可視化を行い、NextAuth.jsによる認証とPrismaを用いたデータ永続化を実現しています。',

        techStack: ['Next.js', 'TypeScript', 'NextAuth.js', 'Prisma', 'Tailwind CSS'],
        period: '2026.02',
        githubUrl: 'https://github.com/m-guchi/asset-manager',
        links: [
            { label: '本番環境', url: 'https://asset.minagu.work/' }
        ],
    },
    {
        id: '2',
        title: '入退場管理システム',

        description: 'QRコードを用いて建物・部屋内の出入りを管理できるシステム。ログインに必要なユーザー情報はGithubで確認してください。',

        techStack: ['PHP', 'MySQL', 'React'],
        period: '2020.08 ~ 2022.10',
        githubUrl: 'https://github.com/m-guchi/access_controll_system',
        links: [
            { label: 'デモサイト', url: 'https://app.minagu.work/access_controll/' }
        ],
    },
    {
        id: '3',
        title: 'O-1投票システム',

        description: '大学祭で使用する予定だったO-1グランプリの投票システム。投票画面・管理画面で投票結果をリアルタイムに確認できる。',

        techStack: ['PHP', 'MySQL', 'React'],
        period: '2020.08 ~ 2020.10',
        links: [
            { label: 'Github 投票画面', url: 'https://github.com/m-guchi/o1_vote_viewer' },
            { label: '投票デモサイト', url: 'https://app.minagu.work/o1-vote/viewer/' },
            { label: 'Github 管理画面', url: 'https://github.com/m-guchi/o1_vote_admin' },
            { label: '管理デモサイト', url: 'https://app.minagu.work/o1-vote/admin/' },
        ],
    },
];
