/*
  M3Script / MikuMikuScript

  Copyright (C) 2011 fullkawa<fullkawa@gmail.com>

  This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
  published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
  of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*
 * [コーディング規約]
 *
 * - enchant.Class.create で定義したクラスのメソッドは(initialize以外)
 *   enchant.m3.`ClassName`.prototype.`MethodName` にて"一つずつ"定義する
 *   ※ eclipse でメンバ表示させるため
 *   メソッドがないクラスは DUMMY メソッドを定義する
 *   ※ eclipse でクラス表示させるため
 */

/*
 * 今後の方針とか
 *
 * TODO: ver.0.9を固める
 *  - 残りのタスクを片付ける > https://twitter.com/#!/messages
 *   - shot_type, wait -> scenario, player ; setting?
 *   - "phase" -> load scenario, message
 *   - duration
 *   - selection into message
 *   - click -> selection color change + ちと、ボタンも小さいかな･･･
 *
 *  - http://wise9.jp/archives/2822 をテスト、プレイヤー名をどう保存するか？
 *  - 一通りのブラウザ / jsdo.it, 9leapでテストする
 *
 * TODO: あんな定義ファイルを固め、jsdo.itにビューワを用意する
 *        背景画像は…素材があればいいけど、とりあえず無しで？
 *
 * TODO: あんな自己紹介と何本かのショートストーリーを投稿
 *  - jsdo.it経由で9leapへ？
 */

enchant.m3 = {};

/**
 * [ 画像定義 ]
 *  シナリオ中で使用される画像の定義
 *
 *  定義には二種類あります。
 *  定義の記述を楽にするための「共通定義」と
 *  実際の「定義」です。
 *
 *  @param {Object} desc 定義記述
 */
enchant.m3.ImgDefinition = function(desc) {
	try {
		/**
		 * @type {Array} 共通定義とみなされる定義名
		 */
		this.COMMON_DEF_NAMES = ['current'];

		/**
		 * @type {Object} _default デフォルト/共通定義
		 *
		 * デフォルト定義とは、クラスによって定義された共通定義のことです。
		 * さらにユーザが作成した定義ファイルによって上書きされたものが共通定義として利用されます。
		 */
		this._default = {
			current: { location: '' }
		};

		/**
		 * @type {Object} 有効な定義
		 * keyが定義名、valueが省略時の細目名
		 */
		this.DEF_NAMES = { images: 'img' };

		/**
		 * @type {Object} _definition 定義
		 */
		this._definition = {};

		/**
		 * @type {Object} プロパティ
		 *
		 * key: 画像のキー(一意な名称)
		 * value: そのキーで示される画像のプロパティ
		 */
		this._props = {};

		this.addDefinition(desc);
	}
	catch(e) {
		console.warn(e);
	}
};

enchant.m3.ImgDefinition.prototype = {
	/**
	 * 定義を(追加)読み込みする
	 * @param {Object} desc 定義記述
	 *
	 * * setter for this._default, _definition
	 */
	addDefinition: function(desc) {
//console.debug(desc);
		try {
			this._loadCommonDefinition(desc);
			this._loadDefinition(desc);
			this._setProps();
		}
		catch(e) {
			console.warn(e);
		}
	},

	/**
	 * 共通定義をロードする
	 *
	 * * setter for this._default
	 */
	_loadCommonDefinition: function(desc) {
		try {
			if (desc != undefined) {
				for (var i=0; i<this.COMMON_DEF_NAMES.length; i++) {
					var key = this.COMMON_DEF_NAMES[i];
//console.debug(key);
//console.debug(this._default[key]);
					var def_name = this.DEF_NAMES[key];
					var normalized = this._normalize(desc[key], def_name);
					this._default[key] = overwrite(normalized, this._default[key]);
//console.debug(this._default[key]);
				}
			}
		}
		catch(e) {
			console.warn(e);
		}
	},

	/**
	 * 定義をロードする
	 *
	 * * setter for this._definition
	 */
	_loadDefinition: function(desc) {
		try {
			if (desc != undefined) {
				for (var key in desc) {
					var def_name = this.DEF_NAMES[key];
					if (def_name != undefined) {
						var normalized = this._normalize(desc[key], def_name);
						this._definition[key] = overwrite(normalized, this._definition[key]);
					}
				}
			}
		}
		catch(e) {
			console.warn(e);
		}
	},

	/**
	 * 簡易定義/詳細定義の違いを吸収する。すなわち常に「詳細定義」が得られる
	 *
	 * @param def {Any} 定義内容
	 * @param def_name {String} 簡易定義の時、マッピングされる定義細目名
	 *
	 * * def -> noramalized
	 */
	_normalize: function(def, def_name) {
		var normalized = {};
		try {
			if (typeof(def) == 'string') {
				if (def_name != undefined) {
					normalized[def_name] = def;
				}
				else {
					normalized = def;
				}
			}
			else {
				normalized = def;
			}
		}
		catch(e) {
			console.warn(e);
		}
		return normalized;
	},

	/**
	 * * setter for this._props
	 */
	_setProps: function() {
		try {
			var images = this._definition.images;
			for (var key in images) {
				var value = images[key];
				this._props[key] = overwrite(this._normalizeImage(value), this._props[key]);
			}
		}
		catch(e) {
			console.warn(e);
		}
	},

	_normalizeImage: function(def) {
		var normalized = {};
		try {
			if (typeof(def) == 'string') {
				normalized[this.DEF_NAMES.images] = def;
			}
			else {
				normalized = def;
			}
			normalized.url = getFullURL(normalized.img, this._default.current.location);
		}
		catch(e) {
			console.warn(e);
		}
		return normalized;
	},

	/**
	 * @returns 定義されている画像プロパティの一覧
	 * ※ 画像ビューワでの利用を想定
	 *
	 * * getter for this._props
	 */
	_getImageList: function() {
		return this._props;
	}
};

/**
 * [ 画像バンク ]
 *  背景、イベントCGなど一枚絵の定義
 */
enchant.m3.ImgBank = enchant.Class.create(enchant.m3.ImgDefinition, {
	initialize: function(desc) {
		ImgDefinition.call(this, desc);
	}
});

/**
 * @returns {Object} Player で必要とする画像表示プロパティ一式
 * このクラスのインスタンス名は"i"を推奨する　→ i.mg('キー')
 *
 * * getter for this._props
 */
enchant.m3.ImgBank.prototype.mg = function(key) {
console.debug(this._props);
	var prop = this._props[key];

	prop.fitScreen = true;

	return prop;
};

/**
 * [ キャラクター定義 ]
 *  シナリオ中に登場するキャラクターはすべてこのクラスのオブジェクトと
 *  なります。
 *
 * @param {String} name
 *  コンストラクタの第一引数は'キャラクター名'です。
 *
 * @param {Object} desc
 *  第二引数に各定義を記述したオブジェクトを渡します。
 *
 *  images :
 *  表示に使う画像を 'ポーズ名' : '画像ファイルパス' の形式で記述します。
 *  baseURL + 上記パス で画像URLを指定します。
 *  フルパスが記述されている時、baseURLは無視されます。
 *
 *  Webサービス、M3Interface(@see http://m3itfc.appspot.com/)にて画像
 *  ライブラリを提供する予定です。
 */
enchant.m3.Character = enchant.Class.create(enchant.m3.ImgDefinition, {
	initialize: function(name, desc) {
		ImgDefinition.call(this);

		/**
		 * デフォルトの定義
		 */
		// this._default = {};

		/**
		 * 共通定義の定義名
		 */
		this.COMMON_DEF_NAMES.push('shots');

		/**
		 * 有効な定義名
		 */
		// this.DEF_NAMES = {};

		/**
		 * キャラクター名(識別子)
		 * @type {String}
		 */
		this.id = name;

		/**
		 * キャラクターが現在取っているポーズの名前
		 * 画像ファイルを取得する際のキーとなる
		 * @type {String}
		 */
		this.key = '';

		/**
		 * キャラクターが現在取っているポーズの画像ファイルURL
		 * @type {String}
		 */
		this.url = '';

		/**
		 * キャラクターの立ち位置＝X(横)軸方向の表示位置
		 * X position of character
		 *
		 *   座標ではなく、ゲームスクリーン幅を等分割しての指定となります
		 *   Not coordinates, it is ratio for screen width.
		 *
		 *   'LEFT_EDGE'はスクリーンの左端です。キャラ画像の中心＝左端のため、右半分だけが表示されることになります
		 *   'LEFT_EDGE' is on left edge of screen. It shows right half of character.
		 *
		 *   'LEFT', 'CENTER', 'RIGHT'は画面にキャラが三人並んだ時のそれぞれの位置のイメージです
		 *   'LEFT', 'CENTER' and 'RIGHT' is position in 3 person.
		 *
		 *   同様に、'LEFT2', 'RIGHT2'は二人並んだ時の位置のイメージとなります
		 *   'LEFT2', 'RIGHT2' is postion in 2 person.
		 */
		this.POSITIONS = ['LEFT_EDGE', 'LEFT', 'LEFT2', 'CENTER', 'RIGHT2', 'RIGHT', 'RIGHT_EDGE'];

		/**
		 * キャラクターの立ち位置＝X(横)軸方向の表示位置
		 * @see this.prototype.POSITIONS
		 * @type {Number}
		 */
		this.posX = this.POSITIONS.indexOf('CENTER');

		/**
		 * キャラクターの表示位置オフセット
		 * @type {Number}
		 */
		this.offsetX = 0;
		this.offsetY = 0;

		/**
		 * メッセージウィンドウに表示されるキャラクター名
		 * ※作中にて変更可能
		 */
		this.name = name;

		/**
		 * キャラクターの現在の台詞
		 */
		this.msg = '';

		/**
		 * キャラクターのショット(表示範囲)
		 *
		 * cu: Close Up 顔(クローズアップ)
		 * bs: Bust Shot 胸から上
		 * ws: Waist Shot 腰から上
		 * ks: Knee Shot ひざから上
		 */
		SHOT_TYPES = ['cu', 'bs', 'ws', 'ks'];

		this.addDefinition(desc);

		/**
		 * メソッドチェーンでプロパティを引き継ぐためのコピー
		 */
		this._self = this;
	}
});

/**
 * Character用の定義処理
 * @param desc
 *
 * * setter for this._default, _definition
 */
enchant.m3.Character.prototype.addDefinition = function(desc) {
	this._loadCommonDefinition(desc);
	this._loadDefinition(desc);
	this._defImages();
};

/**
 * * setter for this._props
 */
enchant.m3.Character.prototype._defImages = function() {
	var images = this._definition.images;
	for (var key in images) {
		var value = images[key];
		this._props[key] = this._normalizeImage(value);
	}
};

//enchant.m3.Character.prototype = {
//	/**
//	 * キャラ定義を追加/上書きします
//	 */
//	_addDefinition: function(definition) {
//		if (definition != undefined) {
//			if (definition.baseURL != undefined) {
//				this._baseURL = definition.baseURL;
//			}
//			if (definition.shots != undefined) {
//				this._defShots = overwrite(definition.shots, this._defShots);
//			}
//
//			var def_images = definition.images;
//			if (def_images != undefined) {
//				// デフォルト値
//				var defs = {
//					baseURL: this._baseURL,
//					shots: this._defShots
//				};
//				for (key in def_images) {
//					// デフォルトのポーズ名設定
//					if (this.key == undefined || this.key.length == 0) this.key = key;
//
//					this._props[key] = overwrite(this._normalizeDefinition(def_images[key], defs), this._props[key]);
//				}
//			}
//		}
//	},
//
//	/**
//	 * キャラ定義を正規化します
//	 * ここでいう正規化とは、簡易定義も詳細定義も同じフォーマットにすることです
//	 *
//	 * [フォーマット]
//	 * - ポーズ名
//	 *   - ショット名
//	 *     - url
//	 *     - baseY
//	 *     - scale
//	 *
//	 * @param {Object} definition ポーズごとの定義
//	 * @param {Object} defs デフォルトの設定
//	 */
//	_normalizeDefinition: function(definition, defs) {
//		var def_pose = {};
//
//		for (var i=0; i<this.SHOT_TYPES.length; i++) {
//			var shot_type = this.SHOT_TYPES[i];
//			var def_shot = {};
//
//			// 共通のショット設定を適用する
//			if (defs.shots == undefined || defs.shots[shot_type] == undefined) {
//				def_shot = {};
//			} else {
//				// def_shot = clone(defs.shots[shot_type]);
//				def_shot = defs.shots[shot_type];
//			}
//
//			if (typeof(definition) == 'string') {
//				// 簡易的な定義
//				def_shot.url = getFullURL(definition, defs.baseURL);
//			}
//			else {
//				// 詳細な定義
//				def_shot.url = getFullURL(definition.img, defs.baseURL);
//				def_shot.keywords = definition.keywords;
//			}
//			def_pose[shot_type] = def_shot;
//		}
//
//		return def_pose;
//	},
//
//	/**
//	 * @returns キャラクタ表示プロパティ一式 character properties
//	 *
//	 *   key: ポーズ名
//	 *
//	 *   url: 画像URL(＝Game.assetsのキー)
//	 *        key of Game.assets
//	 *
//	 *   scale: 表示倍率。ショットによって異なる
//	 *
//	 *   ratioX: キャラクターのX(横)軸方向の表示位置　※画面幅に対する比率
//	 *         position of character
//	 *
//	 *   baseY: キャラクタ表示時、下限のY座標。ショットによって異なる
//	 *
//	 *   offsetX, offsetY: 表示位置のオフセット
//	 *                     position offset
//	 */
//	_getProps: function() {
//		var def = this._props[this.key][this.shot_type];
//
//		var url = '';
//		var scale = 1;
//		var baseY = 0;
//		// ↑FIXME: 簡易定義のときは画像の下端(height)にしたいのだが… shotsをコメントアウトして作成/検証
//		if (def != undefined) {
//			if (def.url != undefined) url = def.url;
//			if (def.scale != undefined) scale = def.scale;
//			if (def.baseY != undefined) baseY = def.baseY;
//		}
//		var props = {
//			key: this.key,
//			url: url,
//			scale: scale,
//			ratioX: this.posX / (this.POSITIONS.length - 1),
//			baseY: baseY,
//			offsetX: this.offsetX,
//			offsetY: this.offsetY
//		};
//		return props;
//	},
//
//	/**
//	 * @returns メッセージプロパティ一式 character words
//	 *
//	 *   name: メッセージウィンドウに表示されるときの名前
//	 *         name in message window
//	 *
//	 *   msg: メッセージウィンドウに表示される文章(＝セリフ)
//	 *        message in message window
//	 */
//	_getWords: function () {
//		var words = {
//			name: this.name,
//			msg: this.msg
//		};
//		return words;
//	},
//};
//
///**
// * 画像の簡易定義/詳細定義の違いを吸収する。すなわち常に「詳細定義」が得られる
// *
// * @param def {Any} 定義内容
// *
// * * def -> noramalized
// */
//enchant.m3.Character.prototype._normalizeImage = function(def) {
//	var normalized = {};
//	if (typeof(def) == 'string') {
//		normalized = {
//			url: getFullURL(def, this._default.current.location),
//			fitScreen: true
//		};
//	}
//	else {
//		normalized = value;
//		normalized.url = getFullURL(def.img, this._default.current.location);
//	}
//	return normalized;
//};

/**
 * get shallow copy
 */
enchant.m3.Character.prototype._clone = function() {
	var cln = new Character();
	for (var key in this._self) {
		var value = this._self[key];
		if (typeof(value) != 'function') {
			cln[key] = value;
		}
	}
	return cln;
};

enchant.m3.Character.prototype.say = function(msg) {
	this.msg = this._self.msg = msg;
	return this._clone();
};

enchant.m3.Character.prototype.as = function(name) {
	this.name = this._self.name = name;
	return this._clone();
};

enchant.m3.Character.prototype.is = function() {
	return this._clone();
};

enchant.m3.Character.prototype.act = function(key) {
	this.key = this._self.key = key;
	return this._clone();
};

enchant.m3.Character.prototype.wiz = function(key) {
	this.key = this._self.key = key;
	return this._clone();
};

/**
 * left position with 3 person
 */
enchant.m3.Character.prototype.onLeft = function(offset) {
	this.posX = this._self.posX = this.POSITIONS.indexOf('LEFT');
	return this.withOffset(offset);
};

/**
 * left position with 2 person
 */
enchant.m3.Character.prototype.onLeft2 = function(offset) {
	this.posX = this._self.posX = this.POSITIONS.indexOf('LEFT2');
	return this.withOffset(offset);
};

enchant.m3.Character.prototype.onCenter = function(offset) {
	this.posX = this._self.posX = this.POSITIONS.indexOf('CENTER');
	return this.withOffset(offset);
};

/**
 * right position with 3 person
 */
enchant.m3.Character.prototype.onRight = function(offset) {
	this.posX = this._self.posX = this.POSITIONS.indexOf('RIGHT');
	return this.withOffset(offset);
};

/**
 * right position with 2 person
 */
enchant.m3.Character.prototype.onRight2 = function(offset) {
	this.posX = this._self.posX = this.POSITIONS.indexOf('RIGHT2');
	return this.withOffset(offset);
};

enchant.m3.Character.prototype.withOffset = function(x, y) {
	if (x != undefined) {
		this.offsetX = this._self.offsetX = x;
	}
	if (y != undefined) {
		this.offsetY = this._self.offsetY = y;
	}
	return this._clone();
};

/**
 * [ シナリオ定義 ]
 */
enchant.m3.Scenario = function() {
	/**
	 * シーケンスデータ
	 *
	 * タイムラインごと(画像(レイヤ)/メッセージ/サウンド)に定義する
	 * 値として定義されるのはオブジェクト。その中に必要なプロパティが定義されている
	 * 値が文字列の場合は、決められた(デフォルトの)プロパティにセットされる
	 * 値が関数の場合は、実行結果が利用される
	 */
	this.sequence = {};

	/**
	 * 文章表示後に表示するメッセージ
	 */
	this.eos = '<div class="m3_eos">[click!]</div>';

	/**
	 * 全シーケンス再生終了後に表示するメッセージ
	 */
	this.eog = 'END';
};
enchant.m3.Scenario.prototype = {
	/**
	 * シーケンス番号として使える最大値
	 */
	MAX_SEQUENCE_NO: 999,

	/**
	 * @deprecated
	 * 最初のシーケンスから再生する
	 * > play on new game
	 */
	start: function() {
		var scenario = this;

		window.onload = function() {
			var player = new Player(scenario);
			player.start();
		};
	}
};

/**
 * 与えられたgameオブジェクトにてシナリオを再生する
 * 既存のgameオブジェクトを渡すことにより、カットバック的な使い方も可能？
 */
enchant.m3.Player = function(scenario) {
	var game = new Game();
	game._player = this;

	/**
	 * ゲームないで使用するパラメータ
	 */
	game.param = {};

	/**
	 * 画像バンク
	 * ※使用されているもののみ
	 * key, value {String} 画像URL
	 */
	this.imgs = {};

	/**
	 * ゲーム画面に表示されている画像要素
	 */
	this.layers = new Layers(this.LAYERS);

	/**
	 * メッセージウィンドウ
	 */
	this.msg = new Message();

	/**
	 * 正規化されたシーケンスデータ
	 * this.layers に表示される
	 */
	this.seqs = [];

	/**
	 * 正規化されたメッセージデータ
	 * this.msg に表示される
	 */
	this.msgqs = [];

	/**
	 * 表示中のシーケンス番号
	 */
	this.seqNo = 0;

	/**
	 * ゲーム画面
	 */
	this.scene = this.build();

	this.setKeybind();

	this.loadScenario(scenario);

	if (scenario.eos != undefined) {
		this.msg.suffix = scenario.eos;
	}

	/**
	 * 指定がないときのショット
	 */
	this.defaultShotType = 'ws';

	/**
	 * 全シーケンス再生終了後に表示するメッセージ
	 */
	this.eog = 'END';
	if (scenario.eog != undefined) {
		this.eog = scenario.eog;
	}
};

enchant.m3.Player.prototype = {
	/**
	 * レイヤ名
	 * 左から順に、上へ重ねられていく
	 */
	LAYERS: ['bg', 'l1', 'l2', 'l3'],

	MESSAGE: 'msg',

	AUDIO: 'audio',

	COMMANDS: { select: 'select' },

	/**
	 * キー → ボタンへの割り当て
	 */
	setKeybind: function() {
		/* FIXME: 選択肢表示中にスキップされると困るので、少なくとも対処方法が見つかるまではOFFにしておく
		var game = enchant.Game.instance;

		game.keybind(13, 'a'); // enter key
		game.keybind(32, 'a'); // space key
		game.addEventListener(enchant.Event.A_BUTTON_DOWN, this.play);
		*/

		/*
		game.keybind(66, 'b'); // 'b' key
		*/
	},

	/**
	 * シナリオを読み込む
	 * @param scenario {Scenario}
	 */
	loadScenario: function(scenario) {
		/**
		 * scenarioがオブジェクト型だったときに読み込む、最大のシーケンス番号
		 */
		var maxSeqNo = scenario.MAX_SEQUENCE_NO;

		// scenarioが配列だったとき、最大シーケンス番号は配列の最後のインデックス
		if (scenario.length != undefined && scenario.length > 0) {
			maxSeqNo = scenario.length - 1;
		}

		for (var i = 0; i<=maxSeqNo; i++) {
			var cut = scenario.sequence[i];
			if (cut != undefined) {
				this.seqs.push(this.getSequence(cut));
				this.msgqs.push(this.getMessage(cut));
			}
		}
	},

	/**
	 * シーケンスデータを正規化しながら取得する
	 *
	 * @param cut 一カット分のシナリオデータ
	 */
	getSequence: function(cut) {
		var sequence = {};

		for (var i=0; i<this.LAYERS.length; i++) {
			var key = this.LAYERS[i];
			var layer = cut[key];
			if (layer != undefined) {
				if (layer instanceof Character) {
					sequence[key] = layer._getProps();
				}
				else {
					sequence[key] = layer;
				}
				this.stockImages(sequence[key]);
			}
		}

		// コマンドはそのままシーケンスへ
		for (var key in this.COMMANDS) {
			var cmd = this.COMMANDS[key];
			if (cut[cmd] != undefined) {
				sequence[cmd] = cut[cmd];
			}
		}

		return sequence;
	},

	/**
	 * 使用される画像URLを重複なしで保持する
	 */
	stockImages: function(seq) {
		var url = seq.url;
		if (url != undefined && typeof(url) == 'string') {
			this.imgs[url] = url;
		}
	},

	/**
	 * メッセージデータを取得する
	 *
	 * @param cut 一カット分のシナリオデータ
	 */
	getMessage: function(cut) {
		var message = {};
		var keys = this.LAYERS.concat([this.MESSAGE, this.COMMANDS['select']]);

		for (var i=0; i<keys.length; i++) {
			var key = keys[i];
			var obj = cut[key];
			if (obj != undefined) {
				if (typeof(obj) == 'string' && obj.length > 0) {
					message = { msg: obj };
				}
				else if (obj instanceof Character) {
					var chara = obj._getWords();
					if (chara.msg != undefined && chara.msg.length > 0) {
						message = {
							name: chara.name,
							msg: chara.msg
						};
					}
				}
				else if (obj.msg != undefined && typeof(obj.msg) == 'string' && obj.msg.length > 0) {
					message = { msg: obj.msg };
				}
			}
		}

		return message;
	},

	/**
	 * ゲーム画面を構成する
	 * ※静的な画面要素のみ <-> play
	 *
	 * @returns {enchant.Scene} ゲーム画面
	 */
	build: function() {
		var screen = new Scene();
		screen.backgroundColor = 'black';

		/*
		 * 各画面要素の追加
		 */
		screen.addChild(this.layers);

		screen.addChild(this.msg);

		var history_btn = new HistoryBtn('履歴');
		/* TODO: 実装してから
		screen.addChild(history_btn);
		*/

		var game = enchant.Game.instance;
		game.pushScene(screen);

		/*
		 * 各画面要素のレイアウト
		 * clientWidth/Height は pushScene 後にようやく取得できる
		 */
		var width = game.width;
		var height = game.height;
		var baseY = game.baseY = height / (4/3);

		// 各レイヤの表示位置はシーケンスにて変動するので省略

		var margin = 4;
		this.msg.x = margin;
		this.msg.y = baseY;
		this.msg.width = width - margin * 2;
		this.msg.height = height - margin - baseY;

		history_btn.width = history_btn._element.clientWidth + 4; // そのままだと縦書きになってしまうので@Firefox
		history_btn.x = width - history_btn._element.clientWidth;
		history_btn.y = baseY - history_btn._element.clientHeight + this.msg.padding;

		game.basicScenes = game._scenes.length;
		return screen;
	},

	/**
	 * 選択肢の表示位置を決める
	 * @param select {enchant.Group}
	 */
	buildSelection: function(select) {
		var baseX = 30;
		var baseY = 60;
		var step = 38;
		for (var i=0; i<select.childNodes.length; i++) {
			var opt = select.childNodes[i];
			opt.x = baseX;
			opt.y = baseY + step * i;
		}
	},

	/**
	 * シーケンスを再生する
	 * ＝動的な画面要素を更新する <-> build
	 */
	play: function() {
		var game = enchant.Game.instance;
		var self = game._player;
		if (self != undefined) {
			self.clearPops();
			var pop = null;

			if (self.seqNo < self.seqs.length) {
				var seq = self.seqs[self.seqNo];

				var select = seq[self.COMMANDS['select']];
				if (select != undefined) {
					var self_select = new Selection(game);
					self_select.setSequence(select);
					self.buildSelection(self_select);
					pop = self_select;
				}

				var next_seq = self.seqs[self.seqNo + 1];
				self.layers.setSequence(seq, next_seq);

				self.msg.setSequence(self.msgqs[self.seqNo]);
				self.msg.setPop(pop);

				self.seqNo++;
				if (self.seqNo == self.seqs.length) {
					self.msg.setEnd(true);
				}
			} else {
				alert(self.eog);
			}
		}
	},

	/**
	 * ポップアップ(追加されたSceneオブジェクト：選択肢など)を追加する
	 */
//	addPop: function(pop) {
//		var game = enchant.Game.instance;
//		var scene = new Scene();
//		scene.addChild(pop);
//		game.pushScene(scene);
//	},

	/**
	 * ポップアップをクリアする
	 */
	clearPops: function() {
		var game = enchant.Game.instance;
		for (var i=0; i < (game._scenes.length - game.basicScenes); i++) {
			game.popScene();
		}
	},

	/**
	 * ゲームをスタートさせる
	 */
	start: function() {
		var game = enchant.Game.instance;
		game.preload(this.getImageURLArray());

		game.onload = function() {
			game.params = {};
			game._player.play();
		};
		game.start();
	},

	/**
	 * 使用画像URLを配列で全て取得する
	 * @returns {Array}
	 */
	getImageURLArray: function() {
		var arr = [];
		for (var key in this.imgs) {
			var url = this.imgs[key];
			if (url != undefined && typeof(url) == 'string') arr.push(url);
		}
		return arr;
	}
};

/**
 * 画面に表示される画像要素のグループ
 */
enchant.m3.Layers = enchant.Class.create(enchant.Group, {
	/**
	 * @param {Array} layer_ids レイヤIDのセット
	 */
	initialize: function(layer_ids) {
		Group.call(this);

		if (layer_ids == undefined || layer_ids.length == undefined) {
			console.warn('layer_ids is illegal.');
		} else {
			this.ids = layer_ids;

			for (var i=0; i<this.ids.length; i++) {
				var id = this.ids[i];
				this[id] = new Layer(id);
				this.addChild(this[id]);
			}
		}

		this.addEventListener(enchant.Event.ENTER_FRAME, function() {
			// TODO: 全レイヤに適用されるanimation/transition
		});
	}
});

/**
 * シーケンス情報をセットする
 * 処理は完全に Layer に委譲される
 *
 * @param seq {Object}
 * @param next_seq {Object} (optional)
 */
enchant.m3.Layers.prototype.setSequence = function(seq, next_seq) {
	for (var i=0; i<this.ids.length; i++) {
		var id = this.ids[i];
		this[id].setSequence(seq, next_seq);
	}
};

/**
 * 画面に表示される一つの画像要素
 * 他の要素と重ねて表示される
 *
 * 表示開始状態(img)と表示終了状態(next_img)を持ち、フレームごとに書き換える
 * ことで、アニメーションに対応している
 */
enchant.m3.Layer = enchant.Class.create(enchant.Group, {
	initialize: function(layer_id) {
		Group.call(this);
		this.id = layer_id;
		var game = enchant.Game.instance;

		/**
		 * 表示開始状態
		 * @type enchant.Sprite
		 */
		this.img = new Sprite(game.width, game.height);
		this.addChild(this.img);

		/**
		 * 表示終了状態
		 * @type enchant.Sprite
		 */
		this.next_img = new Sprite(game.width, game.height);
		this.next_img.visible = false;
		this.addChild(this.next_img);

		this.addEventListener(enchant.Event.ENTER_FRAME, function() {
			// TODO: animation/transition
		});
	}
});

/**
 * シーケンス情報をセットする
 * 処理は setImage に委譲される
 *
 * @param {Object} seq
 * @param {Object} next_seq (optional)
 */
enchant.m3.Layer.prototype.setSequence = function(seq, next_seq) {
	if (seq != undefined) {
		if (seq[this.id] != undefined) this.setImage.call(this.img, seq[this.id]);

		if (next_seq != undefined) {
			if (next_seq[this.id] != undefined) this.setImage.call(this.next_img, next_seq[this.id]);
		}
	}
	else {
		console.warn('seq is undefined.');
	}
};

enchant.Event.ON_READY = 'onready';

/**
 * 表示する画像の各プロパティをセットする
 * this = Sprite オブジェクト
 * @param {Object} seq = 対象レイヤのみのシーケンスデータ
 *
 * [セットされるプロパティ]
 *   url	: 画像のURL
 *   x, y, scaleX, scaleY, opacity は enchant.Sprite に準じます
 */
enchant.m3.Layer.prototype.setImage = function(seq) {
	if (seq != undefined) {
		var game = enchant.Game.instance;

		if (seq['url'] != undefined) {
			this.image = game.assets[seq['url']];
		}

		if (seq['fitScreen'] == true) {
			enchant.m3.Layer.prototype.fitScreen.call(this);
		}
		else {
			this.width = this.image.width;
			this.height = this.image.height;

			var scale = seq['scale'];
			if (scale != undefined && typeof(scale) == 'number') {
				this.scaleX = scale;
				this.scaleY = scale;
			}

			var ratioX = seq['ratioX'];
			if (ratioX != undefined && typeof(ratioX) == 'number') {
				this.x = game.width * ratioX - this.width / 2;
			}

			var baseY = seq['baseY'];
			if (baseY != undefined && typeof(baseY) == 'number') {
				this.y = game.baseY - baseY;
			}
		}

		/**
		 * 直接指定することが出来るプロパティ
		 */
		var enable_props = ['x', 'y', 'scaleX', 'scaleY', 'opacity'];
		for (var key in enable_props) {
			if (seq[key] != undefined) this[key] = seq[key];
		}

		// FIXME: on test
		var e = new enchant.Event(enchant.Event.ON_READY);
console.debug(e);
		this.dispatchEvent(e);
	}
	else {
		console.warn('seq is undefined.');
	}
};

/**
 * 画像を縦あるいは横の小さい方が(ゲーム)スクリーンいっぱいになるよう
 * 拡大/縮小する
 * this = Sprite オブジェクト
 */
enchant.m3.Layer.prototype.fitScreen = function() {
	var img = this.image;
	var trimmed_img = new Surface(this.width, this.height);
	var offsetX = 0;
	var offsetY = 0;
	var whRatio_src = img.width / img.height;
	var whRatio_dist = this.width / this.height;
	if (whRatio_dist < whRatio_src) {
		// cut off both side
		offsetX = Math.floor((img.width - img.height / whRatio_dist) / 2);
	} else {
		// cut off ceil and floor
		offsetY = Math.floor((img.height - img.width * whRatio_dist) / 2);
	}
	trimmed_img.draw(img, offsetX, offsetY, img.width - offsetX * 2, img.height - offsetY * 2, 0, 0, this.width, this.height);
	this.image = trimmed_img;
};


/**
 * 角丸めされたLabel
 */
enchant.m3.RoundLabel =  enchant.Class.create(enchant.Label, {
	/**
	 * @param text {String}
	 */
	initialize: function(text) {
		Label.call(this, text);
		this._element.className = 'round_label';

		this.padding = 8; // from m3script.css
	},

	/**
     * RoundLabelのx座標.
     * @type {Number}
	 * @override Node.x
	 */
	x: {
		get: function() {
			return this._x;
		},
		set: function(x) {
			this._x = x;
			this._updateCoordinate();
		}
	},

	/**
     * RoundLabelのx座標.
     * @type {Number}
	 * @override Node.y
	 */
	y: {
		get: function() {
			return this._y;
		},
		set: function(y) {
			this._y = y;
			this._updateCoordinate();
		}
	},

    /**
     * RoundLabelの横幅.
     * @type {Number}
     * @override Entity.width
     */
    width: {
        get: function() {
        	return this._width;
        },
        set: function(width) {
            this._style.width = (this._width = width - this.padding * 2) + 'px';
        }
    },

    /**
     * RoundLabelの高さ.
     * @type {Number}
     * @override Entity.height
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._style.height = (this._height = height - this.padding * 2) + 'px';
        }
    }
});

enchant.m3.RoundLabel.prototype.DUMMY = function() {
};

/**
 * メッセージウィンドウ
 */
enchant.m3.Message =  enchant.Class.create(enchant.m3.RoundLabel, {
	/**
	 * @param text {String}
	 */
	initialize: function() {
		RoundLabel.call(this);
		this._element.className += ' m3_message';

		/**
		 * ウィンドウに現在表示されているテキスト
		 */
		this.text = '';

		/**
		 * ウィンドウに表示するテキスト
		 * (文字送り中でまだ表示されていない部分も含む)
		 */
		this.textBuf = '';

		/**
		 * 文字送りされない、固定文字列
		 * 台詞の主の名前など
		 */
		this.prefix = '';

		/**
		 * テキストの最後に表示される固定文字列
		 * 文字送りの指示/アイコンなど
		 */
		this.suffix = '';

		/**
		 * 文字送りのためのカウンタ
		 */
		this.cnt = 0;

		/**
		 * 文字送りの表示スピード
		 * 小さいほど遅い
		 */
		this.weight = 1;

		/**
		 * 自動文字送りのスピード(単位：fps)
		 * 0未満だと自動文字送りしない
		 */
		this.wait = 60;

		/**
		 * メッセージ表示後にポップアップ表示されるノード
		 */
		this.pop = null;

		this.addEventListener(enchant.Event.ENTER_FRAME, function() {
			this.text = this.prefix + this.textBuf.substring(0, this.cnt * this.weight);

			if (this.cnt > this.textBuf.length) {
				if (this.pop != null && this.pop != undefined) {
					var game = enchant.Game.instance;
					var scene = new Scene();
					scene.addChild(this.pop);
					game.pushScene(scene);
				}
				else {
					this.text += this.suffix;
					if (this.wait >= 0 && this.cnt > this.textBuf.length + this.wait) {
						enchant.m3.Player.prototype.play();
					}
				}
			}
			this.cnt++;
		});

		/**
		 * タッチ無効フラグ
		 */
		this.touch_disabled = false;

		this.addEventListener(enchant.Event.TOUCH_START, function() {
			if (!this.touch_disabled) enchant.m3.Player.prototype.play();
		});
	}
});

enchant.m3.Message.prototype.setPop = function(pop) {
	if (pop == null) {
		this.touch_disabled = false;
	} else {
		this.touch_disabled = true;
	}
	this.pop = pop;
};

/**
 * シーケンスをセットする
 */
enchant.m3.Message.prototype.setSequence = function(seq) {
	if (seq != undefined) {
		this.setMessage(seq.msg, seq.name);
	}
	else {
		console.warn('seq is undefined.');
	}
};

/**
 * テキストをメッセージウィンドウに表示する
 * @param text {String} 表示するテキスト
 * @param name {String} 表示するのがキャラクターの台詞の場合、そのキャラクターの名前
 */
enchant.m3.Message.prototype.setMessage = function(text, name) {
	this.text = '';
	this.textBuf = '';
	this.prefix = '';
	this.cnt = 0;

	if (name != undefined) {
		this.prefix = '<div class="m3_msg_name">' + name + '</div>';
	}
	if (text != undefined) {
		this.textBuf = text;
	}

	// FIXME: on test
	this.addEventListener(enchant.Event.ON_READY, function() {
		console.debug('catch ON_READY');
	});
};

/**
 * メッセージ表示終了フラグをセットする
 * @param flag
 */
enchant.m3.Message.prototype.setEnd = function(flag) {
	// TODO: リファクタリング
	if (flag == true) {
		this.wait = -1;
		this.suffix = '';
	}
};

/**
 * 履歴ウィンドウボタン
 */
enchant.m3.HistoryBtn = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(text) {
		RoundLabel.call(this, text);
		this._element.className += ' m3_historybtn';

		// タッチしたら、履歴ウィンドウが開く
		this.addEventListener(enchant.Event.TOUCH_START, function() {
			console.debug('HistoryBtn / enchant.Event.TOUCH_START');
			// TODO: タッチしたら、履歴ウィンドウが開く
		});
	}
});
enchant.m3.HistoryBtn.prototype.DUMMY = function() {
};

/**
 * メッセージ履歴ウィンドウ
 */
enchant.m3.HistoryMsg = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(text) {
		RoundLabel.call(this, text);
		this._element.className += ' m3_historymsg';

		// タッチしたら、履歴ウィンドウをたたむ
		this.addEventListener(enchant.Event.TOUCH_START, function() {
			console.debug('HistoryMsg / enchant.Event.TOUCH_START');
			// TODO: タッチしたら、履歴ウィンドウをたたむ
		});
	}
});
enchant.m3.HistoryMsg.prototype.DUMMY = function() {
};

/**
 * 選択ウィンドウ
 */
enchant.m3.Selection = enchant.Class.create(enchant.Group, {

	initialize: function() {
		Group.call(this);
	}
});

enchant.m3.Selection.prototype.setSequence = function(seq) {
	/* msg はメッセージウィンドウに表示される
	if (seq.msg != undefined) {
		var msg = new RoundLabel(seq.msg);
		msg._element.className += ' m3_selection';
		this.addChild(msg);
	}
	*/
	if (seq.options != undefined) {
		for (var key in seq.options) {
			var opt = new SelOption(seq.options[key]);
			this.addChild(opt);
		}
	}
};

/**
 * 選択肢ボタン
 */
enchant.m3.SelOption = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(def) {
		RoundLabel.call(this, def.label);
		this._element.className = 'm3_seloption';

		var game = enchant.Game.instance;

		if (def.linkTo != undefined) {
			// タッチしたら「リンク先へ移動」
			this.addEventListener(enchant.Event.TOUCH_START, function() {
				location.href = def.linkTo;
			});
		}
		else if (def.exec != undefined) {
			// タッチで関数実行した後、次へ進む
			this.addEventListener(enchant.Event.TOUCH_START, function() {
				def.exec.call(game);
				game._player.play();
			});
		}
		else {
			// 何もせずに次へ進む
			this.addEventListener(enchant.Event.TOUCH_START, function() {
				game._player.play();
			});
		}
	}
});

enchant.m3.SelOption.prototype.DUMMY = function() {
};

/**
 * TODO: 入力ダイアログ
 */
enchant.m3.InputDialog = enchant.Class.create({});

enchant.m3.InputDialog.prototype.DUMMY = function() {
};

/*
 * ユーティリティとして使われるクラス、関数
 * > utility classes and functions
 */

/**
 * 取得しうるもっとも長いURL(絶対URLとは限らない)を取得する
 *
 * @param {String} url
 *
 * @param {String} baseURL
 * URLに"http://"等が含まれないとき、baseURLがurlの前に追加される
 */
function getFullURL(url, baseURL) {
	var fullURL = url;
	try {
		if (url != undefined && typeof(url) == 'string' && url.length > 0) {
			if (baseURL != undefined && typeof(baseURL) == 'string' && baseURL.length > 0) {
				if (url.charAt(0) == '/') {
					fullURL = url.substring(1, url.length);
				}
				if (baseURL.charAt(baseURL.length-1) != '/') {
					baseURL = baseURL + '/';
				}

				if (url.indexOf('://') > 0) {
					// That url is 'full', so nothing to do.
				}
				else {
					fullURL = baseURL + fullURL;
				}
			}
		}
	}
	catch(e) {
		console.warn(e);
	}
	return fullURL;
}

/**
 * @returns オブジェクトのコピー
 */
function clone(src) {
	var cloned = overwrite(src, {});
	return cloned;
}

/**
 * オブジェクトの内容を上書きする
 * オブジェクト以外(typeof(src)!='object')も上書き出来るが、それはただの値置換
 *
 * @param {Object} src 上書きするオブジェクト
 * @param {Object} target 上書きされるオブジェクト
 */
function overwrite(src, target) {
	try {
		if (src != undefined) {
			if (typeof(src) == 'object') {
				if (target == undefined) target = {};
				for (var key in src) {
					var type = typeof(src[key]);
					if (type == 'object') {
						target[key] = overwrite(src[key], target[key]);
					}
					else {
						target[key] = src[key];
					}
				}
			}
			else {
				target = src;
			}
		}
	}
	catch(e) {
		console.warn(e);
	}
	return target;
}
