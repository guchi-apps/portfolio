import { LegalPageLayout } from "@/components/legal-page-layout"

export const metadata = {
    title: "利用規約 | gucchii.com",
}

export default function TermsOfServicePage() {
    return (
        <LegalPageLayout title="利用規約" updatedAt="2026年7月29日">
            <p>
                この利用規約（以下「本規約」）は、GUCCHII.COM（以下「当サイト」）の利用条件を定めるものです。当サイトを利用したユーザーは、本規約に同意したものとみなします。
            </p>

            <section>
                <h2>1. サイトの内容</h2>
                <p>
                    当サイトは、運営者個人のポートフォリオおよびシステムダッシュボードとして、経歴・制作物・稼働状況等の情報を掲載するものです。
                </p>
            </section>

            <section>
                <h2>2. 禁止事項</h2>
                <p>当サイトの利用にあたり、以下の行為を禁止します。</p>
                <ul>
                    <li>管理画面への不正アクセスまたはそれを試みる行為</li>
                    <li>運営者、その他第三者になりすます行為</li>
                    <li>当サイトのサーバーやネットワークに過度な負荷をかける行為</li>
                    <li>法令または公序良俗に違反する行為</li>
                </ul>
            </section>

            <section>
                <h2>3. サービスの変更・停止</h2>
                <p>
                    運営者は、ユーザーへの事前の通知なく、当サイトの内容の全部または一部を変更し、追加し、または提供を停止・中断・終了することができるものとします。これによりユーザーに生じた損害について、運営者は責任を負わないものとします。
                </p>
            </section>

            <section>
                <h2>4. 免責事項</h2>
                <p>
                    当サイトに掲載する情報の正確性・最新性・完全性について、運営者は保証しません。当サイトの利用により生じたいかなる損害についても、運営者は責任を負わないものとします。
                </p>
            </section>

            <section>
                <h2>5. 著作権</h2>
                <p>
                    当サイトに掲載するコンテンツ（文章・画像・デザイン等）の著作権は、特に断りがない限り運営者に帰属します。無断での転載・複製を禁止します。
                </p>
            </section>

            <section>
                <h2>6. 本規約の変更</h2>
                <p>
                    運営者は、必要に応じて本規約の内容を予告なく変更することがあります。変更後の内容は、当サイトに掲載した時点から効力を生じるものとします。
                </p>
            </section>

            <section>
                <h2>7. 準拠法</h2>
                <p>本規約の解釈にあたっては、日本法を準拠法とします。</p>
            </section>

            <section>
                <h2>8. お問い合わせ</h2>
                <p>
                    運営者: GUCCHII.COM
                    <br />
                    連絡先: <a href="mailto:app@gucchii.com">app@gucchii.com</a>
                </p>
            </section>
        </LegalPageLayout>
    )
}
