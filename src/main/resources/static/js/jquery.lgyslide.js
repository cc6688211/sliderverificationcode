/**
 * Created by lgy on 2017/10/21. 图片验证码
 */
(function($) {
	$.fn.imgcode = function(options) {
		// 初始化参数
		var defaults = {
			frontimg : "",
			backimg : "",
			refreshImg : "",
			getsuccess : "",
			getfail : "",
			maskclose : true,
			callback : "", // 回调函数
			refreshcallback : "",
			yHeight : 1

		};
		var opts = $.extend(defaults, options);
		return this
				.each(function() {
					var $this = $(this);// 获取当前对象
					var html = '<div class="code-k-div">'
							+ '<div class="code_bg"></div>'
							+ '<div class="code-con">'
							+ '<div class="code-img">'
							+ '<div class="code-img-con">'
							+ '<div class="code-mask"><img class="code-front-img" src="'
							+ opts.frontimg
							+ '"></div>'
							+ '<img class="code-back-img" src="'
							+ opts.backimg
							+ '"></div>'
							+ '<div class="code-push"><i class="icon-login-bg icon-w-25 icon-push">刷新</i><span class="code-tip"></span></div>'
							+ '</div>' + '<div class="code-btn">'
							+ '<div class="code-btn-img code-btn-m"></div>'
							+ '<span class="code-span">按住滑块，拖动完成上方拼图</span>'
							+ '</div></div></div>';
					$this.html(html);
					$(".code-mask").css("margin-top",opts.yHeight+"px")
					// 定义拖动参数
					var $divMove = $(this).find(".code-btn-img"); // 拖动按钮
					var $divWrap = $(this).find(".code-btn");// 鼠标可拖拽区域
					var mX = 0, mY = 0;// 定义鼠标X轴Y轴
					var dX = 0, dY = 0;// 定义滑动区域左、上位置
					var isDown = false;// mousedown标记
					if (document.attachEvent) {// ie的事件监听，拖拽div时禁止选中内容，firefox与chrome已在css中设置过-moz-user-select:
												// none; -webkit-user-select:
												// none;
						$divMove[0].attachEvent('onselectstart', function() {
							return false;
						});
					}
					// 按钮拖动事件
					$divMove.unbind('mousedown').on({
						mousedown : function(e) {
							// 清除提示信息
							$this.find(".code-tip").html("");
							var event = e || window.event;
							mX = event.pageX;
							dX = $divWrap.offset().left;
							dY = $divWrap.offset().top;
							isDown = true;// 鼠标拖拽启
							$(this).addClass("active");
							// 修改按钮阴影
							$divMove.css({
								"box-shadow" : "0 0 8px #666"
							});
						}
					});
					// 点击背景关闭
					if (opts.maskclose) {
						$this.find(".code_bg").unbind('click').click(
								function() {
									$this.html("");
								})
					}
					// 刷新code码
					$this.find(".icon-push").unbind('click').click(function() {
						opts.refreshcallback();
					});
					// 鼠标点击松手事件
					$divMove.unbind('mouseup')
							.mouseup(
									function(e) {
										var lastX = $this.find(".code-mask")
												.offset().left
												- dX - 1;
										isDown = false;// 鼠标拖拽启
										$divMove.removeClass("active");
										// 还原按钮阴影
										$divMove.css({
											"box-shadow" : "0 0 3px #ccc"
										});
										returncode(lastX);
									});
					// 滑动事件
					$divWrap
							.mousemove(function(event) {
								var event = event || window.event;
								var x = event.pageX;// 鼠标滑动时的X轴
								if (isDown) {
									if (x > (dX + 30)
											&& x < dX + $(this).width() - 20) {
										$divMove.css({
											"left" : (x - dX - 20) + "px"
										});// div动态位置赋值
										$this.find(".code-mask").css({
											"left" : (x - dX - 30) + "px"
										});
									}
								}
							});
					// 返回坐标系
					function returncode(xpos) {
						opts.callback({
							xpos : xpos
						});
					}
					// 验证数据
					function checkcode(code) {
						var iscur = true;
						// 模拟ajax
						setTimeout(function() {
							if (iscur) {
								checkcoderesult(1, "验证通过");
								$this.find(".code-k-div").remove();
								opts.callback({
									code : 1000,
									msg : "验证通过",
									msgcode : "23dfdf123"
								});
							} else {
								$divMove.addClass("error");
								checkcoderesult(0, "验证不通过");
								opts.callback({
									code : 1001,
									msg : "验证不通过"
								});
								setTimeout(function() {
									$divMove.removeClass("error");
									$this.find(".code-mask").animate({
										"left" : "0px"
									}, 200);
									$divMove.animate({
										"left" : "10px"
									}, 200);
								}, 300);
							}
						}, 500)
					}
					// 刷新图标
					opts.refreshImg = function(data) {
						console.log(data)
						$this.find(".code-img-con .code-front-img").attr("src",
								data.frontImg);
						$this.find(".code-img-con .code-back-img").attr("src",
								data.backGoundImg);
					}
					// 验证成功
					opts.getsuccess = function() {
						checkcoderesult(1, "验证通过");
						setTimeout(function() {
							$this.find(".code-k-div").remove();
						}, 800);

					}
					// 验证失败
					opts.getfail = function(txt) {
						$divMove.addClass("error");
						checkcoderesult(0, txt);
						setTimeout(function() {
							$divMove.removeClass("error");
							$this.find(".code-mask").animate({
								"left" : "0px"
							}, 200);
							$divMove.animate({
								"left" : "10px"
							}, 200);
						}, 400);
					}
					// 验证结果
					function checkcoderesult(i, txt) {
						if (i == 0) {
							$this.find(".code-tip").addClass("code-tip-red");
						} else {
							$this.find(".code-tip").addClass("code-tip-green");
						}
						$this.find(".code-tip").html(txt);
					}
				})
	}
})(jQuery);