import { LegalPageLayout } from "@/components/legal-page-layout"

export const metadata = {
    title: "プライバシーポリシー | gucchii.com",
}

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout title="プライバシーポリシー" updatedAt="2026年7月29日">
            <p>
                GUCCHII.COM（以下「当サイト」）は、本ポリシーに基づき、当サイトが取得する情報の取り扱いについて定めます。
            </p>

            <section>
                <h2>1. 取得する情報</h2>
                <p>当サイトは、以下の情報を取得する場合があります。</p>
                <ul>
                    <li>
                        管理画面（<code>/edit</code>、<code>/admin</code>
                        ）へのログイン時に、Googleアカウントによる認証（Google OAuth）を通じて取得するメールアドレスなどの基本的なプロフィール情報
                    </li>
                    <li>管理画面へのログイン時のIPアドレス</li>
                </ul>
                <p>
                    管理画面は運営者本人のみが利用する機能であり、あらかじめ許可された特定のGoogleアカウントを保有するユーザーのみログインできます。一般の閲覧者がアカウント登録・ログインする機能はありません。
                </p>
            </section>

            <section>
                <h2>2. 利用目的</h2>
                <p>取得した情報は、以下の目的のみに利用します。</p>
                <ul>
                    <li>管理画面へのアクセスを許可されたGoogleアカウントの保有者に限定するための認証</li>
                    <li>不正アクセスの早期発見を目的とした、ログイン発生時の運営者への通知</li>
                </ul>
            </section>

            <section>
                <h2>3. 第三者への提供・委託</h2>
                <p>
                    当サイトは、取得した情報を法令に基づく場合を除き第三者に提供しません。認証基盤として
                    Google および Supabase を利用しており、認証処理に必要な範囲でこれらのサービスに情報が送信されます。ログイン発生の通知は、Discord向けWebhook（Signaly）を通じて運営者にのみ送信され、サーバー上に保存されません。
                </p>
            </section>

            <section>
                <h2>4. Cookie の利用</h2>
                <p>
                    管理画面のログイン状態を維持するため、認証基盤（Supabase
                    Auth）が発行するセッションCookieを使用します。一般の閲覧ページの利用にあたって、Cookieによる個人情報の取得は行いません。
                </p>
            </section>

            <section>
                <h2>5. 情報の開示・削除</h2>
                <p>
                    取得した情報の開示・訂正・削除を希望される場合は、下記のお問い合わせ先までご連絡ください。内容を確認のうえ、合理的な範囲で対応します。
                </p>
            </section>

            <section>
                <h2>6. 本ポリシーの変更</h2>
                <p>
                    当サイトは、必要に応じて本ポリシーの内容を予告なく変更することがあります。変更後の内容は、当サイトに掲載した時点から効力を生じるものとします。
                </p>
            </section>

            <section>
                <h2>7. お問い合わせ</h2>
                <p>
                    本ポリシーに関するお問い合わせは、下記メールアドレスまでご連絡ください。
                </p>
                <p>
                    運営者: GUCCHII.COM
                    <br />
                    連絡先: <a href="mailto:app@gucchii.com">app@gucchii.com</a>
                </p>
            </section>
        </LegalPageLayout>
    )
}
