/*
 * [ シナリオ ]
 */

scenario = {}; // この行は消さないでください

/*
 * 以下はシナリオの記述例です。
 * 自分のゲームのシナリオを書く際はすべて消してください。
 */

// 記述例１ * 実際に動作を確認することが出来ます

// 最初の数字は、シナリオ名です。数字じゃなく、名前(例：'第一章')にすることも可能です。
// ただし、最初に表示されるのは scenario['1'] なので、これは必ず定義してください。
scenario['1'] = {
	// 二つ目の数字は、いわばカット番号です。
	//
	// シナリオ作成中にカットの挿入/削除/入れ替えは頻繁にあるかと思います。
	// そのため、最初は"000"等の適当な番号にしておき、最後に採番するのが
	// 効率的かもしれません。
	1: {
		// msg で画面に文章を表示することができます。
		msg: 'シーン１ / カット１'
	},
	2: {
		msg: 'シーン１ / カット２'
	},
	3: {
		// select で選択肢を表示することができます。
		//
		// options で選択肢の定義をします。
		// label が画面に表示される文字、linkTo が移動先です。
		// 移動先の指定もURLで行いますので、実は普通のWebサイト(例：'http://google.com/')
		// へ飛ばすことも出来ます。
		// 通常は、"index.html?"の後ろにシナリオ名を書くことになります。
		//
		// msg は省略も可能です。
		select: {
			msg: "移動します。",
			options: {
				1: { label: 'Aルートへ', linkTo: 'index.html?Aルート' },
				2: { label: 'Bルートへ', linkTo: 'index.html?Bルート' }
			}
		}
	}
};

scenario['Aルート'] = {
		1: {
			msg: 'こちらはAルートです。'
		}
	};

scenario['Bルート'] = {
		1: {
			msg: 'こちらはBルートです。'
		}
	};

// 記述例２ * 動作しません(させるためには、他の定義や画像ファイルの追加が必要です)
/*
scenario['1'] = {
	1: {
		// "bg","l1","l2","l3"のレイヤを指定し、そのレイヤに表示する画像を
		// 指定します。
		//
		// 画像の指定方法は…
		//  1. [ 背景画像/一枚絵 定義 ] で定義した画像名
		//  2. 定義したキャラクター変数名(index.htmlの例の場合、"chara1")＋メソッド
		// のいずれかとなります。

		// 背景画像の指定例です。
		bg: 'bg01',

		// キャラクター(立ち絵)の指定例です。
		//
		// act()メソッド、wiz()メソッドはポーズを指定します。キャラクター定義
		// で定義したポース名だけが有効です。
		// ポーズの指定を省略したときは一番目に定義したポーズが表示されます。
		//
		// say()メソッドはカッコ内のセリフを表示します。
		// セリフにはHTMLタグをそのまま利用できます。
		//
		// asメソッドは画面にキャラ名をどう表示するかを指定します。
		//
		// メソッドは複数の種類を連結出来ます。
		//
		l1: miku.act().say('まずはお約束の… "Hello, world !"').as('[ ミク ]')
	},
	2: {

		l1: miku.say('またね！').wiz('笑顔')
	},
	3: {
		// onLeft(), onLeft2(), onCenter(), onRight2(), onRight()メソッド
		// はキャラクターの表示位置を指定します。
		l1: miku.onLeft()
	},
	4: {
		// 指定がないレイヤは、前カットの画像が引き継がれます。
		// これらをクリアするためには clear と指定する必要があります。
		// clear: 'l1' でl1レイヤのみ、clear: 'all' で全レイヤをクリアしま
		// す。
		clear: 'all'
	}
};
*/
