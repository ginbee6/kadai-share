import Link from 'next/link'

const steps = [
  {
    icon: '👥',
    title: 'グループを作成する',
    color: 'border-indigo-500',
    items: [
      'ホーム画面の「グループを作成する」にグループ名を入力',
      '「グループを作成」ボタンを押す',
      'グループページが開き、6文字の招待コードが表示される',
    ],
  },
  {
    icon: '📨',
    title: '招待コードをクラスメートに共有する',
    color: 'border-blue-500',
    items: [
      'グループページ上部に表示される招待コード（例: ABC123）をコピー',
      'LINEやSlackなどでクラスメートに送る',
      'コードを受け取った人はホーム画面から「グループに参加する」で入力',
    ],
  },
  {
    icon: '📝',
    title: '課題を追加する',
    color: 'border-green-500',
    items: [
      'グループページ右下の「＋」ボタンをタップ',
      '科目・課題タイトル・締め切り日時を入力（必須）',
      '優先度（高/中/低）・メモ・追加者名は任意で入力',
      '「課題を追加」ボタンで登録完了',
    ],
  },
  {
    icon: '✅',
    title: '課題を完了にする',
    color: 'border-yellow-500',
    items: [
      '課題カードの左側の丸ボタンをタップで完了/未完了を切り替え',
      '完了状態は自分のブラウザにのみ保存される',
      '他のメンバーの表示には影響しない',
    ],
  },
  {
    icon: '🗑️',
    title: '課題を非表示にする',
    color: 'border-red-500',
    items: [
      '課題カード右端のゴミ箱アイコンをタップ',
      '自分の画面からのみ消える（他のメンバーには表示される）',
      'グループから課題を完全に削除するわけではない',
    ],
  },
  {
    icon: '📅',
    title: 'マイカレンダーを使う',
    color: 'border-purple-500',
    items: [
      'ホーム画面の「マイカレンダーを見る」をタップ',
      '参加中の全グループの締め切りが1つのカレンダーに表示される',
      '色の意味：🔴 3日以内 / 🟡 7日以内 / 🟢 余裕あり / ⚫ 期限超過',
      '日付をタップするとその日の課題一覧が表示される',
    ],
  },
  {
    icon: '📱',
    title: 'スマホのホーム画面に追加する',
    color: 'border-pink-500',
    items: [
      '【iPhone】Safariでアプリを開き、共有ボタン→「ホーム画面に追加」',
      '【Android】Chromeでアプリを開き、メニュー→「ホーム画面に追加」',
      'アプリのように使えるようになる',
    ],
  },
  {
    icon: '🔁',
    title: '複数グループを管理する',
    color: 'border-orange-500',
    items: [
      '訪問したグループはホーム画面に自動で一覧表示される（最大10件）',
      '各グループをタップするだけで切り替えられる',
      '不要なグループは「×」ボタンで一覧から削除できる',
    ],
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/" className="text-indigo-200 hover:text-white text-sm">
            ← ホーム
          </Link>
          <h1 className="text-xl font-bold mt-1">操作ガイド</h1>
          <p className="text-indigo-200 text-xs mt-0.5">KA-DDY の使い方</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-12">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border-l-4 ${step.color} shadow-sm overflow-hidden`}
          >
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{step.icon}</span>
                <h2 className="font-bold text-gray-800">{step.title}</h2>
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                  STEP {i + 1}
                </span>
              </div>
              <ol className="space-y-2">
                {step.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {j + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}

        {/* カラー凡例 */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-3">⚠️ 締め切りの色の見方</h2>
          <div className="space-y-2">
            {[
              { color: 'bg-red-500', label: '3日以内', desc: '急いで取り組もう' },
              { color: 'bg-yellow-400', label: '7日以内', desc: 'そろそろ準備を' },
              { color: 'bg-green-500', label: '7日以上', desc: '余裕あり' },
              { color: 'bg-gray-400', label: '期限超過', desc: '期限を過ぎています' },
            ].map(({ color, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
                <span className="text-sm font-medium text-gray-700 w-20">{label}</span>
                <span className="text-sm text-gray-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-block"
          >
            さっそく使ってみる →
          </Link>
        </div>
      </div>
    </div>
  )
}
