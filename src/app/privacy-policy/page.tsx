import { LegalPageLayout } from "@/components/legal-page-layout"

export const metadata = {
    title: "プライバシーポリシー | Gucchii Apps",
}

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout title="プライバシーポリシー" updatedAt="2026年8月1日">
            <p>
                Gucchii Apps（以下「当サイト」）は、本ポリシーに基づき、当サイトが取得する情報の取り扱いについて定めます。
            </p>

            <section>
                <h2>1. 取得する情報</h2>
                <p>
                    運営者は、当サイト（Gucchii Apps）を含む複数のWebアプリケーションを運営しており、これらのアプリケーションでは共通してGoogle・GitHubアカウントによるログイン機能（Google
                    OAuth）を提供しています。ログインの際、以下の情報を取得する場合があります。
                </p>
                <ul>
                    <li>認証サービス（Google OAuth・GitHub OAuth）を通じて取得するメールアドレス・プロフィール画像などの基本的なプロフィール情報</li>
                    <li>ログイン時のIPアドレス</li>
                </ul>
                <p>
                    なお、一部のサイトへのログインは、あらかじめ許可された特定のGoogleアカウントを保有するユーザーに限定されています。
                </p>
                <p>
                    「IssueDeck」では、ログインに加えてGitHub
                    Appのインストールにより、ユーザーが選択したリポジトリへのアクセス許可を取得します。これにより、対象リポジトリのIssue情報（タイトル・本文・ラベル・担当者・コメント数等）を取得し、表示・検索を高速化する目的でサーバー側のデータベースに保存します。Issue本文などのコンテンツ自体（リポジトリのソースコード等）は取得しません。
                </p>
            </section>

            <section>
                <h2>2. 利用目的</h2>
                <p>取得した情報は、以下の目的のために利用します。</p>
                <ul>
                    <li>ログイン認証: アカウントを用いた本人確認のため</li>
                    <li>アカウント管理: ログイン状態・アカウント情報の管理・維持のため</li>
                    <li>サービス提供: 各アプリケーションの機能を提供するため</li>
                    <li>不正利用防止: 不正アクセスやなりすまし等の防止・検知のため</li>
                </ul>
            </section>

            <section>
                <h2>3. 第三者への提供・委託</h2>
                <p>
                    運営者は、取得した情報を法令に基づく場合を除き第三者に提供しません。認証基盤として
                    Google、GitHub および Supabase を利用しており、認証処理に必要な範囲でこれらのサービスに情報が送信されます。
                </p>
            </section>

            <section>
                <h2>4. Cookie の利用</h2>
                <p>
                    ログイン状態を維持するため、認証基盤（Supabase
                    Auth）が発行するセッションCookieを使用します。一般の閲覧ページの利用にあたって、Cookieによる個人情報の取得は行いません。
                </p>
            </section>

            <section>
                <h2>5. 情報の開示・削除</h2>
                <p>
                    取得した情報の開示・訂正・削除を希望される場合は、下記のお問い合わせ先までご連絡ください。内容を確認のうえ、合理的な範囲で対応します。
                </p>
                <p>
                    IssueDeckについては、アプリ内の設定画面から「アカウントを削除」を行うことで、ログイン情報およびキャッシュしたIssue情報を含むアプリ内データを削除できます。なお、GitHub
                    App自体の連携解除（インストールの取り消し）は、GitHubの設定画面からユーザー自身で行う必要があります。
                </p>
            </section>

            <section>
                <h2>6. 本ポリシーの変更</h2>
                <p>
                    運営者は、必要に応じて本ポリシーの内容を予告なく変更することがあります。変更後の内容は、当サイトに掲載した時点から効力を生じるものとします。
                </p>
            </section>

            <section>
                <h2>7. お問い合わせ</h2>
                <p>
                    本ポリシーに関するお問い合わせは、下記メールアドレスまでご連絡ください。
                </p>
                <p>
                    運営者: Gucchii Apps
                    <br />
                    連絡先: <a href="mailto:app@gucchii.com">app@gucchii.com</a>
                </p>
            </section>
        </LegalPageLayout>
    )
}
