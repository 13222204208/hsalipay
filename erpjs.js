var curRow, curCol, loading, SYSTEM = system = parent.SYSTEM,
	billRequiredCheck = system.billRequiredCheck,
	requiredMoney = system.requiredMoney,
	taxRequiredCheck = system.taxRequiredCheck,
	taxRequiredInput = system.taxRequiredInput,
	hiddenAmount = !1,
	urlParam = Public.urlParam(),
	disEditable = urlParam.disEditable,
	qtyPlaces = Number(parent.SYSTEM.qtyPlaces),
	pricePlaces = Number(parent.SYSTEM.pricePlaces),
	amountPlaces = Number(parent.SYSTEM.amountPlaces),
	defaultPage = Public.getDefaultPage(),
	pageid='sales-salesOrder',
	THISPAGE = {
		init: function(a) {
			this.mod_PageConfig = Public.mod_PageConfig.init("salesOrder"), SYSTEM.isAdmin !== !1 || SYSTEM.rights.AMOUNT_OUTAMOUNT || (hiddenAmount = !0, $("#amountArea").hide()), this.initDom(a), this.loadGrid(a), this.initCombo(), a.id > 0 && a.checked ? this.disableEdit() : (this.editable = !0, $("#grid").jqGrid("setGridParam", {
				cellEdit: !0
			})), this.addEvent(), setTimeout(function() {
				$("#grid").jqGrid("nextCell", 1, 1)
			}, 10), $.cookie("BarCodeInsert") && THISPAGE.$_barCodeInsert.addClass("active"), this.goodsEdittypeInit()
		},
		initDom: function(a) {
			var b = this;
			if (this.$_customer = $("#customer"),
			this.$_carriervoyno=$('#carriervoyno').val(system.endDate),
			this.$_portofloading=$('#portofloading'),
			this.$_finaldestination=$('#finaldestination'),
			this.$_origin=$('#origin'),
			this.$_packtext=$('#packtext'),
			this.$_moneytype=$('#moneytype'),
			this.$_insurance=$('#insurance'),
			this.$_pricetext=$('#pricetext'),
			this.$_weightdiff=$('#weightdiff'),
			this.$_paymenttext=$('#paymenttext'),
			this.$_dtotalAmount=$('#dtotalAmount'),
			this.$_document=$('#document'),
			this.$_date = $("#date").val(system.endDate), this.$_deliveryDate = $("#deliveryDate").val(system.endDate), this.$_number = $("#billNo"), 
			this.$_classes = $("#classes"), this.$_note = $("#note"), this.$_discountRate = $("#discountRate"), 
			this.$_deduction = $("#deduction"), this.$_discount = $("#discount"), 
			this.$_payment = $("#payment"), this.$_arrears = $("#arrears"),
			 $("#storage").data("defItem", 0),
			 this.$_totalArrears = $("#totalArrears"), this.$_toolTop = $("#toolTop"), this.$_toolBottom = $("#toolBottom"), this.$_paymentTxt = $("#paymentTxt"), this.$_accountInfo = $("#accountInfo"), this.$_userName = $("#userName"), this.$_modifyTime = $("#modifyTime"), this.$_createTime = $("#createTime"), this.$_checkName = $("#checkName"), 
			 this.customerArrears = 0, this.$_note.placeholder(), "add" !== a.status || a.salesId) var c = ["id", a.salesId];
			else var c = 0;
			if (this.salesCombo = Business.billSalesCombo($("#sales"), {
				defaultSelected: c
			}),this.customerCombo = Business.billCustomerCombo($("#customer"), {
				defaultSelected: -1,
				callback: {
					onChange: function(a) {
						a ? ($("#customer").data("contactInfo", a), b.setSaleByContact(a)) : $("#customer").removeData("contactInfo")
					}
				}
			}), "add" !== a.status || a.buId) {
				var d = {
					id: a.buId,
					name: a.contactName,
					cLevel: a.cLevel
				};
				this.$_customer.data("contactInfo", d), this.customerCombo.input.val(a.contactName);
				for (var e = 0; e < SYSTEM.salesInfo.length; e++) if (SYSTEM.salesInfo[e].id === a.salesId) {
					this.salesCombo.input.val(SYSTEM.salesInfo[e].name);
					break
				}
			} else Public.ajaxPost("../basedata/contact/getRecentlyContact?action=getRecentlyContact", {
				transType: originalData.transType,
				billType: "SO"
			}, function(a) {
				if ("" == b.customerCombo.input.val()) {
					a = a.data;
					var c = {
						id: a.buId,
						name: a.contactName,
						cLevel: a.cLevel
					};
					b.$_customer.data("contactInfo", c), b.customerCombo.input.val(a.contactName), b.setSaleByContact(c)
				}
			});
			
			$("#customer").data("callback", function(a) {
				b.setSaleByContact(a)
			}), this.$_date.datepicker(), this.$_deliveryDate.datepicker(), 
			this.$_carriervoyno.datepicker(),
			a.portofloading && this.$_portofloading.val(a.portofloading),
			a.finaldestination && this.$_finaldestination.val(a.finaldestination),
			a.origin && this.$_origin.val(a.origin),
			a.id>0&&this.$_moneytype.val(a.moneytype),
			a.packtext && this.$_packtext.val(a.packtext),
			a.insurance && this.$_insurance.val(a.insurance),
			a.pricetext && this.$_pricetext.val(a.pricetext),
			a.weightdiff && this.$_weightdiff.val(a.weightdiff),
			a.paymenttext && this.$_paymenttext.val(a.paymenttext),
			a.document && this.$_document.val(a.document), 
			$('#dtotalAmount').val(a.dtotalAmount),
			$("#storage").data("defItem", a.locationId), 
			a.description && this.$_note.val(a.description), this.$_discountRate.val(a.disRate), this.$_deduction.val(a.disAmount), this.$_discount.val(a.amount), this.$_payment.val(a.rpAmount), this.$_arrears.val(a.arrears), requiredMoney ;
			var f = '<a id="add" class="ui-btn ui-btn-sp">??????</a><a id="save" class="ui-btn">??????</a>',
				g = '<a id="add" class="ui-btn ui-btn-sp">??????</a><a id="edit" class="ui-btn">??????</a><a class="ui-btn" id="audit">??????</a>',
				h = '<a id="add" class="ui-btn ui-btn-sp">??????</a><a href="../scm/invSo/toPdf?action=toPdf&id=' + a.id + '" target="_blank" id="print" class="ui-btn">????????????</a>',
				i = "",
				j = "",
				k = "",
				l = '',
				m = '',
				n = '<a class="ui-btn" id="open">??????</a>';
			billRequiredCheck ? (i = '', j = '',console.log('????????????')) : (g = l + g, this.$_checkName.parent().hide(),console.log('??????'));
			var o = '';
			if (this.btn_edit = g, this.btn_audit = i, this.btn_view = h, this.btn_reaudit = j, this.btn_open = n, a.id > 0) {
				console.log(a)
				if (this.$_number.val(a.billNo), this.$_date.val(a.date), this.$_deliveryDate.val(a.deliveryDate), this.$_totalArrears.val(a.totalArrears), 
				this.$_dtotalAmount.val(a.dtotalAmount),
				this.$_accountInfo.data("accountInfo", a.accounts), -1 === a.accId && (this.$_accountInfo.show(), b.$_payment.attr("disabled", "disabled").addClass("ui-input-dis")), $("#grid").jqGrid("footerData", "set", {
					qty: a.totalQty,
					amount: a.totalAmount
				}), "list" !== urlParam.flag && (o = ""), a.isDelete && $("#mark").addClass("has-closed"), "edit" === a.status) {
					var p = g + i;
					a.isDelete ? p = h + n : p += billRequiredCheck ? a.checked ? m : "" : m, this.$_toolBottom.html('<span id="groupBtn">' + p + "</span>" + o)
				} else if (a.checked) {
					$("#mark").addClass("has-audit");
					var p = l + h + j;
					a.isDelete ? p = h + n : p += m, this.$_toolBottom.html('<span id="groupBtn">' + p + "</span>" + o)
				} else {
					var p = h;
					p += a.isDelete ? n : billRequiredCheck ? a.checked ? m : "" : m, this.$_toolBottom.html('<span id="groupBtn">' + p + "</span>" + o)
				}
				this.idList = parent.cacheList.salesOrderId || [], this.idPostion = $.inArray(String(a.id), this.idList), this.idLength = this.idList.length, 0 === this.idPostion && $("#prev").addClass("ui-btn-prev-dis"), this.idPostion === this.idLength - 1 && $("#next").addClass("ui-btn-next-dis"), this.$_userName.html(a.userName), this.$_modifyTime.html(a.modifyTime), this.$_createTime.html(a.createTime), this.$_checkName.html(a.checkName)
			} else billRequiredCheck ? this.$_toolBottom.html('<span id="groupBtn">' + f + i + "</span>") : this.$_toolBottom.html('<span id="groupBtn">' + f + "</span>"), this.$_userName.html(system.realName || ""), this.$_modifyTime.parent().hide(), this.$_createTime.parent().hide(), this.$_checkName.parent().hide();
			disEditable && (THISPAGE.disableEdit(), this.$_toolBottom.hide())
		},
		loadGrid: function(a) {
		    function aaa(a,b,c){
		        var ha={}
		        if(a){
		            for (var i = 0; i < a.length; i++) {
		                console.log(a[i])
		                ha[a[i].tpid]=a[i]
		            }
		        }
		        return ha;
		    }
			function b(a) {
				if (taxRequiredCheck) {
					var b = $("#grid").jqGrid("getRowData", a),
						c = parseFloat(b.taxRate);
					if ($.isNumeric(c)) {
						var d = parseFloat(b.amount),
							e = d * c / 100,
							f = d + e;
						$("#grid").jqGrid("setRowData", a, {
							tax: e,
							taxAmount: f
						})
					}
				}
			}
			
			function c(a, b, c) {
				return a ? (p(b.rowId), a) : c.invNumber ? c.invSpec ? c.invNumber + " " + c.invName + "_" + c.invSpec : c.invNumber + " " + c.invName : "&#160;"
			}
			function j(a, b) {
				var c = $(".unitAuto")[0];
				return c
			}
			function k(a, b, c) {
				if ("get" === b) {
					if ("" !== $(".unitAuto").getCombo().getValue()) return $(a).val();
					var d = $(a).parents("tr"),
						e = d.data("unitInfo") || {};
					return THISPAGE.unitCombo.selectByIndex(e.unitId || e.id), e.name || ""
				}
				"set" === b && $("input", a).val(c)
			}
			function l() {
				$("#initCombo").append($(".unitAuto").val(""))
			}
			function m(a, b) {
				var c = $(".priceAuto")[0];
				return c
			}
			function n(a, b, c) {
				if ("get" === b) {
					var d = a.val().split("???")[1];
					return d || a.val()
				}
				"set" === b && $("input", a).val(c)
			}
			function o() {
				$("#initCombo").append($(".priceAuto").val(""))
			}
			function p(a) {
				var b = $("#" + a).data("goodsInfo");
				if (b) {
					if (!b.price) {
						var c = q.$_customer.data("contactInfo");
						if (c && c.id) {
							var d = b.salePrice,
								e = [b.salePrice, b.retailPrice, b.salePrice1, b.salePrice2, b.salePrice3];
							d = c.cLevel < 3 ? e[c.cLevel] : (1e4 * b.salePrice * e[c.cLevel] / 1e6).toFixed(2), b.price = d
						}
					}
					console.log(b)
					var f = {
						skuName: b.skuName || "",
						mainUnit: b.mainUnit || b.unitName,
						unitId: b.unitId,
						qty: b.qty || 1,
						price: b.price || b.salePrice,
						discountRate: b.discountRate || 0,
						deduction: b.deduction || 0,
						amount: b.amount,
						locationName: b.locationName,
						taxRate: b.taxRate || taxRequiredInput,
						safeDays: b.safeDays,
						used: b.used,
						tpno:'<a class="dotp" style="color:#9e9d9d" data-id="' + b.id + '" title="??????????????????" href="javascript:;">??????????????????</a>',
					   // tpdata:''
					    
					};
					f.amount = f.amount ? f.amount : f.price * f.qty;
					var g = Number(f.amount);
					console.log(a)
					console.log(f)
					if (taxRequiredCheck) {
						var h = f.taxRate,
							i = g * h / 100,
							j = g + i;
						f.tax = b.tax || i, f.taxAmount = b.taxAmount || j
					}
					var k = $("#grid").jqGrid("setRowData", a, f);
					k && THISPAGE.calTotal()
				}
			}
			function amore(a,b,c){
			    var d='';
			    if(a){
			        if(a=='tpno'){
			             d='<a class="dotp" style="color:#9e9d9d" data-id="' + c.invId + '" title="??????????????????" href="javascript:;">??????????????????</a>'
			        }else{
			            d=a;
			        }
			       
			    }
			    return d
			}
			function bbb(a,b,c){
			    console.log(a)
			    d=''
			    if(a){
			     //   var ha={}
		      //      for (var i = 0; i < a.length; i++) {
		      //          a[i].id=a[i].tpid
		      //          ha[a[i].tpid]=a[i]
		      //      }
			        d=JSON.stringify(a)
			    }
			    return d
			}
			var q = this;
			if (a.id) {
				var r = 5 - a.entries.length;
				if (r > 0) for (var s = 0; r > s; s++) a.entries.push({})
			}
			q.newId = 6;
			var t = [{
				name: "operating",
				label: " ",
				width: 60,
				fixed: !0,
				formatter: Public.billsOper_goods,
				align: "center"
			}, {
				name: "goods",
				label: "??????",
				width: 300,
				classes: "goods",
				formatter: c,
				editable: !0,
				enterCallback: function() {
					if (THISPAGE.$_barCodeInsert.hasClass("active")) {
						var a = function(a) {
								var b = $("#" + a),
									c = b.next(),
									d = b.index() + 1;
								return 0 == c.length ? ($("#grid").jqGrid("addRowData", THISPAGE.newId, {}, "last"), THISPAGE.newId++, $("#" + (THISPAGE.newId - 1)).index()) : c.data("goodsInfo") ? arguments.callee(d) : d
							}(THISPAGE.curID);
						$("#grid").jqGrid("nextCell", a, 1)
					} else 0 != $("#grid")[0].p.savedRow.length && $("#grid").jqGrid("nextCell", $("#grid")[0].p.savedRow[0].id, $("#grid")[0].p.savedRow[0].ic)
				}
			},
			
			{
				name: "qty",
				label: "??????",
				nameExt: '(???)',
				width: 100,
				align: "right",
				classes:'qty',
				formatter: "number",
				formatoptions: {
					decimalPlaces: qtyPlaces
				},
				editable: !1
			},{
				name: "tpdatano",
				label: "tpdatano",
				width: 100,
				align: "right",
				editable: !1,
				hidden: !0,
			},
			{
				name: "tpdata",
				label: "tpdata",
				width: 100,
				align: "right",
				editable: !1,
				hidden: !0,
				formatter: bbb,
			},
			{				
				name: "used",
				label: "?????????????????????",
				width: 60,
				align: "center",
				classes: "useqty",
				hidden: !0,
			}, 
			{
				name: "price",
				label: "????????????",
				hidden: hiddenAmount,
				width: 60,
				fixed: !0,
				align: "right",
				formatter: "currency",
				formatoptions: {
					showZero: !0,
					decimalPlaces: pricePlaces
				},
				editable: !0,
				edittype: "custom",
				editoptions: {
					custom_element: m,
					custom_value: n,
					handle: o,
					trigger: "ui-icon-triangle-1-s"
				}
			}, {
				name: "amount",
				label: "????????????",
				hidden: hiddenAmount,
				width: 60,
				fixed: !0,
				align: "right",
				formatter: "currency",
				formatoptions: {
					showZero: !0,
					decimalPlaces: amountPlaces
				},
				editable: !0
			},{
				name: "tpno",
				label: "??????",
				width: 60,
				align: "center",
				editable: 0,
				edittype: "custom",
				formatter: amore,
			},{
				name: "package",
				label: "????????????",
				width: 60,
				align: "center",
				editable:true,
				classes:"package",
			},{
				name: "repackage",
				label: "????????????",
				width: 60,
				align: "center",
				formatter: "number",
				editable:true,
				// formatoptions: {
				// 	decimalPlaces: qtyPlaces
				// },
				classes:"repackage",
			}];
			this.calAmount = "amount", taxRequiredCheck && (t.pop(), t.push({
				name: "amount",
				label: "??????",
				hidden: hiddenAmount,
				width: 100,
				fixed: !0,
				align: "right",
				formatter: "currency",
				formatoptions: {
					showZero: !0,
					decimalPlaces: amountPlaces
				},
				editable: !0
			}), this.calAmount = "taxAmount"), t.push();
			var u = "grid";
			q.mod_PageConfig.gridReg(u, t), t = q.mod_PageConfig.conf.grids[u].colModel, $("#grid").jqGrid({
				data: a.entries,
				datatype: "clientSide",
				autowidth: !0,
				height: "100%",
				rownumbers: !0,
				gridview: !0,
				onselectrow: !1,
				colModel: t,
				cmTemplate: {
					sortable: !1,
					title: !1
				},
				shrinkToFit: !0,
				forceFit: !1,
				rowNum: 1e3,
				cellEdit: !1,
				cellsubmit: "clientArray",
				localReader: {
					root: "rows",
					records: "records",
					repeatitems: !1,
					id: "id"
				},
				jsonReader: {
					root: "data.entries",
					records: "records",
					repeatitems: !1,
					id: "id"
				},
				loadComplete: function(a) {
					if (THISPAGE.$_barCodeInsert = $("#barCodeInsert"), urlParam.id > 0) {
						var b = a.rows,
							c = b.length,
							d = "";
						q.newId = c + 1;
						for (var e = {}, f = 0; c > f; f++) {
							var g = f + 1,
								h = b[f];
							if ($.isEmptyObject(b[f])) break;
							d += d ? "," + g : g, e[h.invId] = g;
							var i = $.extend(!0, {
								id: h.invId,
								number: h.invNumber,
								name: h.invName,
								spec: h.invSpec,
								unitId: h.unitId,
								unitName: h.mainUnit
							}, h);
							Business.cacheManage.getGoodsInfoByNumber(i.number, function(a) {
								i.isSerNum = a.isSerNum, i.isWarranty = h.isWarranty = a.isWarranty, i.safeDays = h.safeDays = a.safeDays, i.invSkus = a.invSkus, i.id = h.invId, $("#" + g).data("goodsInfo", i).data("storageInfo", {
									id: h.locationId,
									name: h.locationName
								}).data("unitInfo", {
									unitId: h.unitId,
									name: h.mainUnit
								}).data("skuInfo", {
									name: h.skuName,
									id: h.skuId
								})
							})
						}
					}
				},
				gridComplete: function() {
					setTimeout(function() {
						Public.autoGrid($("#grid"))
					}, 10)
				},
				afterEditCell: function(a, b, c, d, e) {
					function f() {
						var b = $("#" + a).data("goodsInfo");
						if (b) {
							var c = $("#grid").jqGrid("getRowData", a);
							b = $.extend(!0, {}, b), b.skuName = c.skuName, b.mainUnit = c.mainUnit, b.unitId = c.unitId, b.qty = c.qty, b.price = c.price, b.discountRate = c.discountRate, b.deduction = c.deduction, b.amount = c.amount, b.taxRate = c.taxRate, b.tax = c.tax, b.taxAmount = c.taxAmount, b.locationName = c.locationName, $("#" + a).data("goodsInfo", b)
						}
					}
					if (THISPAGE.curID = a, "goods" === b && (f(), $("#" + d + "_goods", "#grid").val(c), THISPAGE.goodsCombo.selectByText(c)), "skuName" === b) {
						f();
						var g = $("#" + a).data("goodsInfo");
						if (!g || !g.invSkus || !g.invSkus.length) return $("#grid").jqGrid("restoreCell", d, e), curCol = e + 1, $("#grid").jqGrid("nextCell", d, e + 1), void THISPAGE.skuCombo.loadData([]);
						"string" == typeof g.invSkus && (g.invSkus = $.parseJSON(g.invSkus)), $("#" + d + "_skuName", "#grid").val(c), THISPAGE.skuCombo.loadData(g.invSkus || [], 1, !1), THISPAGE.skuCombo.selectByText(c)
					}
					if ("price" === b && $("#" + d + "_price", "#grid").val(c), "locationName" === b && ($("#" + d + "_locationName", "#grid").val(c), THISPAGE.storageCombo.selectByText(c)), "mainUnit" === b) {
						$("#" + d + "_mainUnit", "#grid").val(c);
						var h = $("#" + a).data("unitInfo") || {};
						if (!h.unitId || "0" === h.unitId) return $("#grid").jqGrid("restoreCell", d, e), curCol = e + 1, void $("#grid").jqGrid("nextCell", d, e + 1);
						THISPAGE.unitCombo.enable(), THISPAGE.unitCombo.loadData(function() {
							for (var a = {}, b = 0; b < SYSTEM.unitInfo.length; b++) {
								var c = SYSTEM.unitInfo[b],
									d = h.unitId;
								h.unitId == c.id && (h = c), h.unitId = d;
								var e = c.unitTypeId || b;
								a[e] || (a[e] = []), a[e].push(c)
							}
							return h.unitTypeId ? a[h.unitTypeId] : [h]
						}), THISPAGE.unitCombo.selectByText(c)
					}
				},
				formatCell: function(a, b, c, d, e) {},
				beforeSubmitCell: function(a, b, c, d, e) {},
				beforeSaveCell: function(a, b, c, d, e) {
					switch (b) {
					case "goods":
						var f = $("#" + a).data("goodsInfo");
						var th=this
						console.log($("#storage").getCombo().getValue())
						if (!f) {
							q.skey = c;
							var g, h = function(b) {
									$("#" + a).data("goodsInfo", b).data("storageInfo", {
										id: b.locationId,
										name: b.locationName
									}).data("unitInfo", {
										unitId: b.unitId,
										name: b.unitName
									}), g = Business.formatGoodsName(b)
								};
							return THISPAGE.$_barCodeInsert.hasClass("active") ? Business.cacheManage.getGoodsInfoByBarCode(c, h, !0) : Business.cacheManage.getGoodsInfoByNumber(c, h, !0), g ? g : (
							    console.log(3333),
							    $.dialog({
								width: 800,
								height: 510,
								title: "????????????",
								content: "url:../settings/goods_batch",
								data: {
									skuMult: $("#storage").getCombo().getValue(),
									skey: q.skey,
									locationId:$("#storage").getCombo().getValue(),
									callback: function(a, b, c) {
										"" === b && ($("#grid").jqGrid("addRowData", a, {}, "last"), q.newId = a + 1), setTimeout(function() {
											$("#grid").jqGrid("editCell", c, 2, !0)
										}, 10), q.calTotal()
									}
								},
								init: function() {
									q.skey = ""
								},
								lock: !0,
								button: [{
									name: "??????",
									defClass: "ui_state_highlight fl",
									focus: !0,
									callback: function() {
										return this.content.callback && this.content.callback("purchase"), !1
									}
								}, {
									name: "???????????????",
									defClass: "ui_state_highlight",
									callback: function() {
										return this.content.callback("purchase"), this.close(), !1
									}
								}, {
									name: "??????",
									callback: function() {
										return !0
									}
								}]
							}), setTimeout(function() {
								$("#grid").jqGrid("editCell", curRow, 2, !0), $("#grid").jqGrid("setCell", curRow, 2, "")
							}, 10), "&#160;")
						}
				  
					
					}
					return c
				},
				afterSaveCell: function(a, c, d, e, f) {
					switch (c) {
						case "goods":
							break;
						case "qty":
							
							var d = parseFloat(d),
								g = parseFloat($("#grid").jqGrid("getCell", a, f + 1)),
								h = parseFloat($("#grid").jqGrid("getCell", a, f + 2));
							if ($.isNumeric(g)) if ($.isNumeric(h)) var i = d * g * h / 100,
								j = d * g,
								k = $("#grid").jqGrid("setRowData", a, {
									deduction: i,
									amount: j
								});
							else var k = $("#grid").jqGrid("setRowData", a, {
								amount: d * g
							});
							b(a), k && THISPAGE.calTotal();
							break;
						case "price":
							var d = parseFloat(d),
								l = parseFloat($("#grid").jqGrid("getCell", a, f - 1)),
								h = parseFloat($("#grid").jqGrid("getCell", a, f + 1));
							if ($.isNumeric(l)) if ($.isNumeric(h)) var i = d * l * h / 100,
								j = d * l,
								k = $("#grid").jqGrid("setRowData", a, {
									deduction: i,
									amount: j
								});
							else var k = $("#grid").jqGrid("setRowData", a, {
								amount: d * l
							});
							b(a), k && THISPAGE.calTotal();
							break;
				
				
						case "amount":
							
							var d = parseFloat(d),
								n = $("#grid").jqGrid("getRowData", a),
								i = parseFloat(n.deduction),
								l = parseFloat($("#grid").jqGrid("getCell", a, f - 3));
							if ($.isNumeric(d)) {
								var o = parseFloat(n.qty),
									g = (d + i) / o;
								if ($.isNumeric(l) && $.isNumeric(g)) {
									var m = l * g,
										h = m ? (100 * i / m).toFixed(amountPlaces) : 0;
									$("#grid").jqGrid("setRowData", a, {
										discountRate: h
									})
								}
								$("#grid").jqGrid("setRowData", a, {
									discountRate: h,
									price: g
								})
							}
							b(a), THISPAGE.calTotal();
							break;
			
					}
				},
				loadonce: !0,
				resizeStop: function(a, b) {
					q.mod_PageConfig.setGridWidthByIndex(a, b, "grid")
				},
				footerrow: !0,
				userData: {
					goods: "?????????",
					qty: a.totalQty,
					deduction: a.totalDiscount,
					amount: a.totalAmount,
					tax: a.totalTax,
					taxAmount: a.totalTaxAmount
				},
				userDataOnFooter: !0,
				loadError: function(a, b, c) {
					Public.tips({
						type: 1,
						content: "Type: " + b + "; Response: " + a.status + " " + a.statusText
					})
				}
			})
		},
		setSaleByContact: function(a) {
			var b = this;
			b.salesCombo && Public.ajaxGet("../scm/invSo/findNearSoEmp?action=findNearSoEmp", {
				buid: a.id
			}, function(a) {
				a.data.empId && b.salesCombo.selectByValue(a.data.empId)
			})
		},
		goodsEdittypeInit: function() {
			function a(a, b) {
				var c = $(".goodsAuto")[0];
				return c
			}
			function b(a, b, c) {
				if ("get" === b) {
					if ("" !== $(".goodsAuto").getCombo().getValue()) return $(a).val();
					var d = $(a).parents("tr");
					return d.removeData("goodsInfo"), ""
				}
				"set" === b && $("input", a).val(c)
			}
			function c() {
				$("#initCombo").append($(".goodsAuto").val("").unbind("focus.once"))
			}
			0 != $("#grid")[0].p.savedRow.length && $("#grid").jqGrid("saveCell", $("#grid")[0].p.savedRow[0].id, $("#grid")[0].p.savedRow[0].ic), THISPAGE.$_barCodeInsert.hasClass("active") ? $("#grid").jqGrid("setColProp", "goods", {
				edittype: "text",
				editoptions: null
			}) : $("#grid").jqGrid("setColProp", "goods", {
				edittype: "custom",
				editoptions: {
					custom_element: a,
					custom_value: b,
					handle: c,
					trigger: "ui-icon-ellipsis"
				}
			})
		},
		reloadData: function(a) {
			function b() {
				c.$_customer.data("contactInfo", {
					id: a.buId,
					name: a.contactName,
					
				}),
				c.$_portofloading.val(a.portofloading),
				c.$_finaldestination.val(a.finaldestination),
				c.$_origin.val(a.origin),
				c.$_packtext.val(a.packtext),
				c.$_moneytype.val(a.moneytype),
				c.$_insurance.val(a.insurance),
				c.$_pricetext.val(a.pricetext),
				c.$_weightdiff.val(a.weightdiff),
				c.$_paymenttext.val(a.paymenttext),
				c.$_document.val(a.document), 
				c.$_dtotalAmount.val(a.dtotalAmount), 
				c.customerCombo.input.val(a.contactName), c.salesCombo.selectByValue(a.salesId, !1), c.$_date.val(a.date), c.$_deliveryDate.val(a.deliveryDate), c.$_number.val(a.billNo),  
				c.$_note.val(a.description), c.$_discount.val(a.amount), c.$_payment.val(a.rpAmount), c.accountCombo.selectByValue(a.accId, !1), c.$_accountInfo.data("accountInfo", a.accounts), -1 === a.accId ? c.$_accountInfo.show() : c.$_accountInfo.hide(), c.$_arrears.val(a.arrears), c.$_totalArrears.val(a.totalArrears), c.$_userName.html(a.userName), c.$_modifyTime.html(a.modifyTime), c.$_createTime.html(a.createTime), c.$_checkName.html(a.checkName)
			}
			$("#grid").clearGridData();
			var c = this;
			originalData = a;
			var d = 5 - a.entries.length;
			if (d > 0) for (var e = 0; d > e; e++) a.entries.push({});
			$("#grid").jqGrid("setGridParam", {
				data: a.entries,
				userData: {
					qty: a.totalQty,
					deduction: a.totalDiscount,
					amount: a.totalAmount,
					tax: a.totalTax,
					taxAmount: a.totalTaxAmount,
					
				}
			}).trigger("reloadGrid"), b(), "edit" === a.status ? this.editable || (c.enableEdit(), $("#groupBtn").html(c.btn_edit + c.btn_audit), $("#mark").removeClass("has-audit")) : this.editable && (c.disableEdit(), $("#groupBtn").html(c.btn_view), $("#mark").addClass("has-audit"))
		},
		initCombo: function() {
			var a = this;
			this.storageCombo = $("#storage").combo({
				data: function() {
					for (var a = Public.getDefaultPage(), b = [], c = 0; c < a.SYSTEM.storageInfo.length; c++) {
						var d = a.SYSTEM.storageInfo[c];
						d["delete"] || b.push(d)
					}
					return b
				},
				value: "id",
				text: "name",
				width: 180,
				defaultSelected: 1,
				cache: !1,
				editable: !0,
				emptyOptions: !0,
				//extraListHtml: '<a href="#" class="quick-add-link" onclick="addStorage();return false;"><i //class="ui-icon-add"></i>??????</a>'
			}).getCombo(),this.storageCombo.selectByValue($("#storage").data("defItem")),
			//this.storageCombo = Business.billStorageCombo($("#storage"))
			this.goodsCombo = Business.billGoodsCombo($(".goodsAuto"), {
				disSerNum: !0
			}), this.unitCombo = Business.unitCombo($(".unitAuto"), {
				defaultSelected: -1,
				forceSelection: !1
			}), this.priceCombo = $(".priceAuto").combo({
				data: function() {
					if (!this.input) return [];
					var a = $("#customer").data("contactInfo");
					if (!a) return [];
					var b = this.input.closest("tr"),
						c = b.data("goodsInfo");
					if (!c) return [];
					var d = $("#customer").data("priceList")[c.id];
					if (!d || !d.prices) return [];
					if (a.id <= 0) return [];
					var e = [];
					if (d.prices.levelPrice) {
						var f = "";
						a.cLevel < 3 ? f = ["??????", "??????", "VIP"][a.cLevel] + "??????" + d.prices.levelPrice : d.prices.discountRate && (f = ["?????????", "?????????"][a.cLevel - 3] + "??????" + d.prices.levelPrice * d.prices.discountRate / 100), f && e.push({
							name: f,
							id: 1
						})
					}
					return d.prices.nearPrice && e.push({
						name: "???????????????" + d.prices.nearPrice,
						id: 2
					}), e
				},
				text: "name",
				value: "id",
				defaultSelected: 0,
				cache: !1,
				editable: !0,
				trigger: !1,
				defaultFlag: !1,
				forceSelection: !1,
				listWidth: 140,
				callback: {
					onChange: function(a) {},
					onFocus: function() {
						var b = $(".priceAuto ").siblings(".ui-icon-triangle-1-s").hide(),
							c = this.input.closest("tr"),
							d = c.data("goodsInfo");
						if (d) {
							var e = a.$_customer.data("contactInfo"),
								f = a.$_customer.data("priceList");
							if (f || (f = {}, a.$_customer.data("priceList", f)), e && "" !== $.trim(a.$_customer.find("input").val())) {
								var g = function() {
										var a = {
											cId: e.id
										};
										f[d.id] = a, Public.ajaxPost("../basedata/inventory/listBySelected?action=listBySelected", {
											type: "so",
											ids: d.id,
											contactId: e.id
										}, function(c) {
											if (200 === c.status && c.data && c.data.result) {
												for (var d = c.data.result, e = 0, f = d.length; f > e; e++) {
													var g = d[e];
													g.nearPrice && (a.prices = {}, a.prices.nearPrice = g.nearPrice), g.salePrice && (a.prices = a.prices || {}, a.prices.levelPrice = g.salePrice, a.prices.discountRate = g.discountRate)
												}
												a.prices && b.show()
											}
										})
									};
								if (f[d.id]) {
									var h = f[d.id];
									h.cId != e.id ? g() : h.prices && b.show()
								} else g()
							}
						}
					}
				}
			}).getCombo()
		},
		disableEdit: function() {
			this.customerCombo.disable(),
			this.storageCombo.disable(),
			this.salesCombo.disable(),
			this.$_date.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_deliveryDate.attr("disabled", "disabled").addClass("ui-input-dis"), 
			this.$_note.attr("disabled", "disabled").addClass("ui-input-dis"), 
			this.$_discountRate.attr("disabled", "disabled").addClass("ui-input-dis"), 
			this.$_deduction.attr("disabled", "disabled").addClass("ui-input-dis"), 
			this.$_payment.attr("disabled", "disabled").addClass("ui-input-dis"), //billNo
            this.$_number.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_portofloading.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_carriervoyno.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_finaldestination.attr("disabled", "disabled").addClass("ui-input-dis"),			
			this.$_origin.attr("disabled", "disabled").addClass("ui-input-dis"), 
			this.$_packtext.attr("disabled", "disabled").addClass("ui-input-dis"), //
			this.$_moneytype.attr("disabled", "disabled").addClass("ui-input-dis"), //
			this.$_insurance.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_pricetext.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_weightdiff.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_paymenttext.attr("disabled", "disabled").addClass("ui-input-dis"),
			this.$_document.attr("disabled", "disabled").addClass("ui-input-dis"),	

			$("#grid").jqGrid("setGridParam", {
				cellEdit: !1
			}), this.editable = !1
		},
		enableEdit: function() {
			disEditable || (this.salesCombo.enable(), this.customerCombo.enable(), this.$_date.removeAttr("disabled").removeClass("ui-input-dis"), this.$_deliveryDate.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_portofloading.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_carriervoyno.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_finaldestination.removeAttr("disabled").removeClass("ui-input-dis"),			
				this.$_origin.removeAttr("disabled").removeClass("ui-input-dis"), 
				this.$_number.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_packtext.removeAttr("disabled").removeClass("ui-input-dis"), 
				this.$_moneytype.removeAttr("disabled").removeClass("ui-input-dis"), 
				this.$_insurance.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_pricetext.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_weightdiff.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_paymenttext.removeAttr("disabled").removeClass("ui-input-dis"),
				this.$_document.removeAttr("disabled").removeClass("ui-input-dis"),
			 this.$_note.removeAttr("disabled").removeClass("ui-input-dis"), this.$_discountRate.removeAttr("disabled").removeClass("ui-input-dis"), this.$_deduction.removeAttr("disabled").removeClass("ui-input-dis"), this.$_payment.removeAttr("disabled").removeClass("ui-input-dis"), this.accountCombo.enable(), $("#grid").jqGrid("setGridParam", {
				cellEdit: !0
			}), this.editable = !0)
		},
		addEvent: function() {
			var a = this;
			$("#storage1").on("click", ".ui-icon-triangle-1-s", function(a) {
				a.stopPropagation();
				var b = $(this).siblings()
				console.log(b)
				var	c = b.getCombo();
					
					console.log(c)
				setTimeout(function() {
					c.active = !0, c.doQuery()
				}, 10)
			}),
			this.customerCombo.input.enterKey(), this.$_date.bind("keydown", function(b) {
				13 === b.which && a.$_deliveryDate.trigger("focus").select()
			}).bind("focus", function(b) {
				a.dateValue = $(this).val()
			}).bind("blur", function(b) {
				var c = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
				c.test($(this).val()) || (parent.Public.tips({
					type: 2,
					content: "???????????????????????????2012-08-08???"
				}), $(this).val(a.dateValue))
			}), this.$_deliveryDate.bind("keydown", function(a) {
				13 === a.which && $("#grid").jqGrid("editCell", 1, 2, !0)
			}).bind("focus", function(b) {
				a.dateValue = $(this).val()
			}).bind("blur", function(b) {
				var c = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
				c.test($(this).val()) || (parent.Public.tips({
					type: 2,
					content: "???????????????????????????2012-08-08???"
				}), $(this).val(a.dateValue))
			}), this.$_note.enterKey(), this.$_discount.enterKey(), this.$_discountRate.enterKey(), $(".grid-wrap").on("click", ".ui-icon-triangle-1-s", function(a) {
				var b = $(this).siblings(),
					c = b.getCombo();
				setTimeout(function() {
					c.active = !0, c.doQuery()
				}, 10)
			}), Business.billsEvent(a, "sales"), $(".wrapper").on("click", "#save", function(b) {
				b.preventDefault();
				var c = $(this),
					d = THISPAGE.getPostData();
				d && ("edit" === originalData.stata && (d.id = originalData.id, d.stata = "edit"), c.ajaxPost("../scm/invSo/add?action=add", {
					postData: JSON.stringify(d)
				}, function(b) {
					if (200 === b.status) {
						a.$_modifyTime.html((new Date).format("yyyy-MM-dd hh:mm:ss")).parent().show(), a.$_createTime.html((new Date).format("yyyy-MM-dd hh:mm:ss")).parent().show(), originalData.id = b.data.id;
						var c = a.btn_edit;
						c += billRequiredCheck ? a.btn_audit : a.btn_audit, a.$_toolBottom.html('<span id="groupBtn">' + c + "</span>"), parent.Public.tips({
							content: "???????????????"
						})
					} else parent.Public.tips({
						type: 1,
						content: b.msg
					})
				}))
			}), $(".wrapper").on("click", "#edit", function(b) {
				if (b.preventDefault(), Business.verifyRight("SO_UPDATE")) {
					var c = $(this),
						d = THISPAGE.getPostData();
					d && c.ajaxPost("../scm/invSo/updateInvSo?action=updateInvSo", {
						postData: JSON.stringify(d)
					}, function(b) {
						200 === b.status ? (a.$_modifyTime.html((new Date).format("yyyy-MM-dd hh:mm:ss")).parent().show(), originalData.id = b.data.id, parent.Public.tips({
							content: "???????????????"
						})) : parent.Public.tips({
							type: 1,
							content: b.msg
						})
					})
				}
			}), $(".wrapper").on("click", "#audit", function(b) {
				if (b.preventDefault(), Business.verifyRight("SO_CHECK")) {
					var c = $(this),
						d = THISPAGE.getPostData();
					d && c.ajaxPost("../scm/invSo/checkInvSo?action=checkInvSo", {
						postData: JSON.stringify(d)
					}, function(b) {
						200 === b.status ? (originalData.id = b.data.id, $("#mark").addClass("has-audit"), a.$_checkName.html(SYSTEM.realName).parent().show(), a.disableEdit(), $("#groupBtn").html(a.btn_view), parent.Public.tips({
							content: "???????????????"
						})) : parent.Public.tips({
							type: 1,
							content: b.msg
						})
					})
				}
			}), $(".wrapper").on("click", "#add", function(a) {
				a.preventDefault(), Business.verifyRight("SO_ADD") && parent.tab.overrideSelectedTabItem({
					tabid: "sales-salesOrder",
					text: "????????????????????????",
					url: "../scm/invSo?action=initSo"
				})
			}), $(".wrapper").on("click", "#print", function(a) {

				if (!Business.verifyRight("SO_EXPORT")) return void a.preventDefault();
					var c = originalData.id,
						d = c ? "&id=" + c : "";
					var f = "../scm/invSo/exportsInvSo?action=exportsInvSo" + d;
					$(this).attr("href", f)
			}), //????????????
			$(document).on("click", ".dotp", function(a) {
				a.preventDefault();	
				console.log();
				var th = $(this),
				    recoveryQty=0,
					id = $("#storage").getCombo().getValue(),
					goodsid=th.data('id'),
					trid=th.parent().parent('tr').attr('id');
					var haha= $("#grid").jqGrid("getRowData", trid);
					if(id==0){
						parent.Public.tips({
							type: 2,
							content: "???????????????"
						})
						return false
					}
					var tpinfo=''
					var ha={}
					if(haha.tpdata.length>0){
					    tpinfo=eval('('+haha.tpdata+')');
					    console.log(tpinfo)
					         
    		            for (var i = 0; i < tpinfo.length; i++) {
    		                tpinfo[i].id=tpinfo[i].tpid
    		                ha[tpinfo[i].tpid]=tpinfo[i]
    		            }
					}
				(
    				    $.dialog({
    					width: 800,
    					height: 510,
    					title: "????????????",
    					content: "url:../scm/invSo?action=intp&storageid="+id+'&goodsid='+goodsid,
    					data: {
    						skuMult: $("#storage").getCombo().getValue(),
    						skey: '',
    						storeid: id,
    		            	goodsid:goodsid,
    		            	abc:ha,
    		            	trid:trid,
    		            	tpdatano:haha.tpdatano?haha.tpdatano:0,
    		            	iid:originalData.id,
    		            	status:originalData.status,
    						callback: function(a, b, c) {
    						    
    						   haha.tpdata=JSON.stringify(c);
    						   tpplace=''
    						   var arr=[];
    						   var obj={};
    						   for (v in c) {
    						   	    console.log(c[v])
    						   	    
    						   	    obj={
    						   	    "id":c[v].id,
    						   	    "tpid":c[v].id,
    						   	    "iid":c[v].iid?c[v].iid:0,
    						   	    "tpdatano":c[v].tpdatano?c[v].tpdatano:'',
    						   	    "saleqty":c[v].saleqty,
    						   	    "sy":c[v].sy,
    						   	    "tpno":c[v].tpno,
    						   	    "tpsort":c[v].tpsort,
    						   	    "tpweight":c[v].tpweight?c[v].tpweight:'',
    						   	    "recovery":c[v].recovery=='???'||c[v].recovery=="1"?1:0,
    						   	    "tpplace":c[v].tpplace,
    						   	    'ininvid':c[v].ininvid,
    						   	        
    						   	    }
    						   	    if(c[v].recovery=='???'||c[v].recovery=="1"){
    						   	        recoveryQty++
    						   	        
    						   	    }
    						   	    
    						   	    arr.push(obj)
    						   	    tpplace =c[v].tpplace
    						   	}
							   	var k=$("#grid").jqGrid("setRowData", trid, {
        							qty: b,
        							used: a,
        							package:tpplace,
        							repackage:recoveryQty,
        							tpdata:arr,
        							amount:haha.price*b
        						})
        							k && THISPAGE.calTotal()
        						
    						       
    						   }
    				// 		}
    					},
    					init: function() {
    					// 	q.skey = ""
    					},
    					lock: !0,
    					button: [{
    						name: "??????",
    						defClass: "ui_state_highlight fl",
    						focus: !0,
    						callback: function(a) {
    						    console.log(a)
    							return this.content.callback && this.content.callback("purchase"), !1
    						}
    					}, {
    						name: "???????????????",
    						defClass: "ui_state_highlight",
    						callback: function() {
    							return this.content.callback("purchase"), this.close(), !1
    						}
    					}, {
    						name: "??????",
    						callback: function() {
    							return !0
    						}
    					}]
    				})
							
				)
				
				
				
				
			}),	THISPAGE.$_barCodeInsert.click(function(b) {
				var c = 1;
				THISPAGE.$_barCodeInsert.hasClass("active") ? (THISPAGE.$_barCodeInsert.removeClass("active"), c = null) : THISPAGE.$_barCodeInsert.addClass("active"), a.goodsEdittypeInit(), $.cookie("BarCodeInsert", c)
			}), $("#config").show().click(function(b) {
				a.mod_PageConfig.config()
			}), $(window).resize(function(a) {
				Public.autoGrid($("#grid"))
			})
		},
		resetData: function() {
			var a = this;
			$("#grid").clearGridData();
			for (var b = 1; 8 >= b; b++) $("#grid").jqGrid("addRowData", b, {}), $("#grid").jqGrid("footerData", "set", {
				qty: 0,
				amount: 0
			});
			a.$_note.val(""),
			a.$_carriervoyno.val(""),
			a.$_portofloading.val(""),
			a.$_finaldestination.val(""),
			a.$_origin.val(""),
			a.$_packtext.val(""),
			a.$_moneytype.val("???"),
			a.$_insurance.val(""),
			a.$_pricetext.val(""),
			a.$_weightdiff.val(""),
			a.$_paymenttext.val(""),
			a.$_document.val(""),
			a.$_discountRate.val(originalData.disRate), a.$_deduction.val(originalData.disAmount), a.$_discount.val(originalData.amount), a.$_payment.val(originalData.rpAmount), a.$_arrears.val(originalData.arrears)
		},
		calTotal: function() {
			for (var a = $("#grid").jqGrid("getDataIDs"), b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = a.length; h > g; g++) {
				var i = a[g],
					j = $("#grid").jqGrid("getRowData", i);
				j.qty && (b += parseFloat(j.qty)), j.deduction && (c += parseFloat(j.deduction)), j.amount && (d += parseFloat(j.amount)), j.tax && (e += parseFloat(j.tax)), j.taxAmount && (f += parseFloat(j.taxAmount))
			}
			console.log(d);
			var dtotalAmount=THISPAGE.changeNumMoneyToChinese(d)
			$('#dtotalAmount').val(dtotalAmount);
			if ($("#grid").jqGrid("footerData", "set", {
				qty: b,
				deduction: c,
				amount: d,
				tax: e,
				taxAmount: f
			}), taxRequiredCheck) var k = (f - Number(this.$_deduction.val())).toFixed(2);
			else var k = (d - Number(this.$_deduction.val())).toFixed(2);
			var l = (k - Number(this.$_payment.val())).toFixed(2);
			l = Number(l) ? l : "0.00", this.$_discount.val(k), this.$_arrears.val(l)
		},

		changeNumMoneyToChinese:function (money)
		{
			var cnNums = new Array("???", "???", "???", "???", "???", "???", "???", "???", "???", "???"); //???????????????
			var cnIntRadice = new Array("", "???", "???", "???"); //????????????
			var cnIntUnits = new Array("", "???", "???", "???"); //??????????????????????????????
			var cnDecUnits = new Array("???", "???", "???", "???"); //????????????????????????
			var cnInteger = "???"; //?????????????????????????????????
			var cnIntLast = "???"; //????????????????????????
			var maxNum = 999999999999999.9999; //?????????????????????
			var IntegerNum; //??????????????????
			var DecimalNum; //??????????????????
			var ChineseStr = ""; //??????????????????????????????
			var parts; //???????????????????????????????????????    
			var Symbol="";//???????????????
			if (money == "") {
				return "";
			}

			money = parseFloat(money);
			if (money >= maxNum) {
				alert('????????????????????????');
				return "";
			}
			if (money == 0) {
				ChineseStr = cnNums[0] + cnIntLast + cnInteger;
				return ChineseStr;
			}
			if(money<0)
			{
				money=-money;
				Symbol="??? ";        
			}
			money = money.toString(); //??????????????????
			if (money.indexOf(".") == -1) {
				IntegerNum = money;
				DecimalNum = '';
			} else {
				parts = money.split(".");
				IntegerNum = parts[0];
				DecimalNum = parts[1].substr(0, 4);
			}
			if (parseInt(IntegerNum, 10) > 0) { //????????????????????????
				var zeroCount = 0;
				var IntLen = IntegerNum.length;
				for (var i = 0; i < IntLen; i++) {
					var n = IntegerNum.substr(i, 1);
					var p = IntLen - i - 1;
					var q = p / 4;
					var m = p % 4;
					if (n == "0") {
						zeroCount++;
					}
					else {
						if (zeroCount > 0) {
							ChineseStr += cnNums[0];
						}
						zeroCount = 0; //??????
						ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
					}
					if (m == 0 && zeroCount < 4) {
						ChineseStr += cnIntUnits[q];
					}
				}
				ChineseStr += cnIntLast;
				//????????????????????????
			}
			if (DecimalNum != '') { //????????????
				var decLen = DecimalNum.length;
				for (var i = 0; i < decLen; i++) {
					var n = DecimalNum.substr(i, 1);
					if (n != '0') {
						ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
					}
				}
			}
			if (ChineseStr == '') {
				ChineseStr += cnNums[0] + cnIntLast + cnInteger;
			} else if (DecimalNum == '') {
				ChineseStr += cnInteger;
			}
			ChineseStr = Symbol +ChineseStr;
			console.log(ChineseStr);
			
			return ChineseStr;
		},
		_getEntriesData: function() {
			for (var a = [], b = $("#grid").jqGrid("getDataIDs"), c = 0, d = b.length; d > c; c++) {
				var e, f = b[c],
					g = $("#grid").jqGrid("getRowData", f);
					
				if ("" !== g.goods) {
					var h = $("#" + f).data("goodsInfo"),
						i = $("#" + f).data("storageInfo"),
						j = $("#" + f).data("unitInfo") || {},
						k = $("#" + f).data("skuInfo") || {},
						tpid=$("#" + f).find('.dotp').attr('tpid'),//useqty
					    tpno=$("#" + f).find('.dotp').text();//useqty
						console.log(g.qty)//????????????
						console.log(g.used)//????????????
					if(parseFloat(g.qty)==0){
					    return parent.Public.tips({
							type: 2,
							content: "????????????0???"
						}),!1
					}
					if (parseFloat(g.qty) -parseFloat(g.used)>0) {
						return parent.Public.tips({
							type: 2,
							content: "???????????????????????????????????????????????????"
						}),!1

					}else{
						console.log('????????????')
					}
						// return false;

				// 	$("#grid").jqGrid("editCellByColName", f, "skuName"), !1;
				// 	if (!tpid ||!tpno) return parent.Public.tips({
				// 		type: 2,
				// 		content: "???????????????????????????"
				// 	}),!1,
				    // console.log(g.tpdata)
				    // console.log(typeof(g.tpdata))
				    // console.log(g.tpdata[0].tpid)
    				if (!g.tpdata ||g.tpdata=='[]'|| g.tpdata.length==0 || g.tpdata==null) return  parent.Public.tips({
        				type: 2,
        				content: "???????????????????????????"
        			}), !1;
					
					 $("#grid").jqGrid("editCellByColName", f, "locationName"), !1;
					 e = {
						invId: h.id,
						invNumber: h.number,
						invName: h.name,
						invSpec: h.spec,
						skuId: k.id || -1,
						skuName: k.name || "",
						unitId: j.unitId || -1,
						mainUnit: j.name || "",
						qty: g.qty,
						used: g.used,
						price: g.price,
						discountRate: g.discountRate,
						deduction: g.deduction,
						amount: g.amount,
						description: g.description,
						tpid: tpid,//useqty
				// 		tpno: tpno,//useqty
						useqty: $("#" + f).children('.useqty').text(),//useqty  repackage
						repackage: $("#" + f).children('.repackage').text(),//useqty  repackage
						package: $("#" + f).children('.package').text(),//useqty  repackage,
						tpdata:g.tpdata
						
					}, a.push(e)
				}
			}
			return a
		},
		getPostData: function() {
			var a = this,
				b = this;
				
			null !== curRow && null !== curCol && ($("#grid").jqGrid("saveCell", curRow, curCol), curRow = null, curCol = null);
			var c = b.$_customer.find("input");
			if ("" === c.val()) return b.$_customer.removeData("contactInfo"), parent.Public.tips({
				type: 2,
				content: "??????????????????"
			}), !1;
			var d = b.$_customer.data("contactInfo");
			if (!d || !d.id) return setTimeout(function() {
				c.focus().select()
			}, 15), parent.Public.tips({
				type: 2,
				content: "????????????????????????"
			}), !1;
			
			var e = this._getEntriesData();
			if (!e) return !1;
			if (e.length > 0) {
				var f = $.trim(a.$_note.val()),
					g = {
						id: originalData.id,
						buId: d.id,
						contactName: d.name,
						salesId: a.salesCombo.getValue(),
						salesName: a.salesCombo.getText(),
						date: $.trim(a.$_date.val()),
						deliveryDate: $.trim(a.$_deliveryDate.val()),
						billNo: $.trim(a.$_number.val()),
						transType: 150601,
						entries: e,
						sort:$('#sort').val(),
						totalQty: $("#grid").jqGrid("footerData", "get").qty.replace(/,/g, ""),
						totalAmount: $("#grid").jqGrid("footerData", "get").amount.replace(/,/g, ""),
						dataType:'sell',
						portofloading:$.trim($('#portofloading').val()),
						finaldestination:$.trim($('#finaldestination').val()),
						carriervoyno:$.trim($('#carriervoyno').val()),
						origin:$.trim($('#origin').val()),
						packtext:$.trim($('#packtext').val()),
						insurance:$.trim($('#insurance').val()),
						pricetext:$.trim($('#pricetext').val()),
						weightdiff:$.trim($('#weightdiff').val()),
						paymenttext:$.trim($('#paymenttext').val()),
						document:$.trim($('#document').val()),
						description:$.trim($('#note').val()),
						dtotalAmount:$.trim($('#dtotalAmount').val()),						
						// moneytype:$.trim($('#moneytype').val()),
						moneytype:'???',
						locationId: a.storageCombo.getValue(),
						locationName: 0 === a.storageCombo.getValue() ? "" : a.storageCombo.getText(),
					};
				return taxRequiredCheck && (g.totalTax = $("#grid").jqGrid("footerData", "get").tax.replace(/,/g, ""), g.totalTaxAmount = $("#grid").jqGrid("footerData", "get").taxAmount.replace(/,/g, "")), g
			}
			return parent.Public.tips({
				type: 2,
				content: "???????????????????????????"
			}), $("#grid").jqGrid("editCell", 1, 2, !0), !1
		}
	},
	hasLoaded = !1,
	originalData;
$(function() {
	if (urlParam.id) {
		if (!hasLoaded) {
			var a = $(".bills").hide();
			Public.ajaxGet("../scm/invSo/update?action=update", {
				id: urlParam.id
			}, function(b) {
				200 === b.status ? (originalData = b.data, THISPAGE.init(b.data), a.show(), hasLoaded = !0) : parent.Public.tips({
					type: 1,
					content: b.msg
				})
			})
		}
	} else originalData = {
		id: -1,
		status: "add",
		customer: 0,
		transType: 150601,
		entries: [{
			id: "1",
			mainUnit: null
		}, {
			id: "2"
		}, {
			id: "3"
		}, {
			id: "4"
		}, {
			id: "5"
		}],
		totalQty: 0,
		totalDiscount: 0,
		totalAmount: 0,
		totalTax: 0,
		totalTaxAmount: 0,
		disRate: 0,
		disAmount: 0,
		amount: "0.00",
		rpAmount: "0.00",
		arrears: "0.00",
		accId: 0
	}, THISPAGE.init(originalData)
});
