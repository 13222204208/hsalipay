<?php $this->load->view('header');?>
 
<script type="text/javascript">
var DOMAIN = document.domain;
var WDURL = "";
var SCHEME= "<?php echo sys_skin()?>";
try{
	document.domain = '<?php echo base_url()?>';
}catch(e){
}
//ctrl+F5 增加版本号来清空iframe的缓存的
$(document).keydown(function(event) {
	/* Act on the event */
	if(event.keyCode === 116 && event.ctrlKey){
		var defaultPage = Public.getDefaultPage();
		var href = defaultPage.location.href.split('?')[0] + '?';
		var params = Public.urlParam();
		params['version'] = Date.parse((new Date()));
		for(i in params){
			if(i && typeof i != 'function'){
				href += i + '=' + params[i] + '&';
			}
		}
		defaultPage.location.href = href;
		event.preventDefault();
	}
});
</script>
<link href="<?php echo base_url()?>statics/css/<?php echo sys_skin()?>/bills.css?ver=201511241412" rel="stylesheet" type="text/css">
 
<style>
#barCodeInsert{margin-left: 10px;font-weight: 100;font-size: 12px;color: #fff;background-color: #B1B1B1;padding: 0 5px;border-radius: 2px;line-height: 19px;height: 20px;display: inline-block;}
#barCodeInsert.active{background-color: #23B317;}
.con-footer ul {
    max-width: 100%;
}
.con-footer ul li label {
    display: inline-block;
    width: 90px;
}

.con-footer ul li label {
    display: inline-block;
    /* width:105px; */
    text-align: center;
}
.mb10 {
    margin-bottom: 0px;
}
.ui-input-ph {
    color: #aaa;
    width: 100% !important;
    height: auto !important;
    box-sizing: border-box;
    vertical-align: baseline!important;
    overflow: hidden;
    border: 1px solid #d6dee3!important;
}
</style>
</head>

<body>
<div class="wrapper">
  <span id="config" class="ui-icon ui-state-default ui-icon-config"></span>
  <div class="mod-toolbar-top mr0 cf dn" id="toolTop"></div>
  <div class="bills cf">
    <div class="con-header">
      <dl class="cf">
        <dd class="pct20">
          <label>客户:</label>
          <span class="ui-combo-wrap" id="customer">
            <input type="text" name="" class="input-txt" autocomplete="off" value="" data-ref="date">
            <i class="ui-icon-ellipsis"></i>
          </span>
        </dd>
        <!-- <dd class="pct20">
            <label>发货仓库:</label>
           <span class="ui-combo-wrap" id="storage1">
              <input type="text" class="ui-combo-wrap textbox storageAuto customelement ui-combo-active" name="locationName" autocomplete="off" id="storage">
              <span class="ui-icon-triangle-1-s"></span>
           </span>
			
        </dd> -->
        <dd class="pct20">
          <label>发货仓库</label>
          <span id="storage"><span class="ui-combo-wrap" style="width: 110px;"><input type="text" class="input-txt" autocomplete="off" readonly="readonly" style="cursor: default; width: 84px;"><span class="trigger"></span></span></span>
        </dd>
       
        
        <dd class="pct15 tc" >
          <label>合同日期:</label>
          <input type="text" id="date" class="ui-input ui-datepicker-input" value="2015-10-31">
        </dd>
        <!--<dd class="pct15 tc" >-->
        <!--  <label>交货日期:</label>-->
        <!--  <input type="text" id="deliveryDate" class="ui-input ui-datepicker-input" value="">-->
        <!--</dd>-->
        <!--<dd id="classes" class="pct15 tr" style="display:none">-->
        <!--  <label class="radio">-->
        <!--    <input type="radio" name="classes" value="150601">-->
        <!--    订货</label>-->
        <!--  <label class="radio">-->
        <!--    <input type="radio" name="classes" value="150602">-->
        <!--    退货</label>-->
        <!--</dd>-->
       <dd id="identifier" class="pct15 tc" >
         <label>合同编号:</label>
          <span id="">           
            <input type="text" name="billNo" class="ui-input" id="billNo" value="<?php echo $billNo;?>">
          </span>
         <input type="hidden" name="sort" id="sort" value="<?php echo $sort;?>">
      </dd>

      </dl>
    </div>
    <div class="grid-wrap">
      <table id="grid">
      </table>
      <div id="page"></div>
    </div>
    <div class="con-footer cf">

      <ul id="amountArea" class="cf">
          
          <li id="identifier">
              <label>销售人员:</label>
              <span class="ui-combo-wrap" id="sales">
                  <input type="text" class="input-txt" autocomplete="off">
                  <i class="trigger"></i>
              </span>
          </li>
          <li style=" min-width: 245px;">
          <label style="width:105px">合计大写:</label>
          <input style="width:180px" type="text" id="dtotalAmount" class="ui-input" data-ref="dtotalAmount" disabled="disabled">
        </li>
        </ul>

        <div class="mb10">
            <label>价格术语:</label>
            <textarea type="text" name="pricetext"id="pricetext" class="ui-input ui-input-ph" placeholder="暂无价格术语">工厂交货价</textarea>
        </div>

       
        <div class="mb10">
            <label>付款条件:</label>
            <textarea type="text" name="paymenttext"id="paymenttext" class="ui-input ui-input-ph" placeholder="暂无与付款条例">买方在合同签定后3天内付清货款,否则本合同无效</textarea>
        </div>
      
        <div class="mb10">
            <label>包装:</label>
            <textarea type="text"  name="packtext" id="packtext" class="ui-input ui-input-ph" placeholder="暂无包装信息">进口原厂包装。铁箱系铁箱公司所有，包装数量0个。铁箱如有遗失按价USD360/个赔偿，毁损则按实际情况负担维修费用。铁箱用完以后及时通知卖方，卖方负责回收。</textarea>
        </div>
       
        <div class="mb10">
            <label>交货条款:</label>
            <textarea type="text" name="insurance"id="insurance" class="ui-input ui-input-ph" placeholder="请输入交货条例">卖方收到货款后,立即安排送货。</textarea>
        </div>
        <div class="mb10">
            <label>异议条款:</label>
            <textarea type="text" name="weightdiff"id="weightdiff" class="ui-input ui-input-ph" placeholder="暂无重量异议">重量异议须在货到目的地后7天内提出。卖方保证上述货物是XXX。质量异议须在货物到目的地内90天提出,提出异议时,买方须保证原包装的完好,货物须在无直射阳光、干燥、通风良好的室内仓库保存</textarea>
        </div>
       
        <div class="mb10">
            <label>其他条例:</label>
            <textarea type="text" name="document"id="document" class="ui-input ui-input-ph" placeholder="暂无与其他条例">本合同未尽事宜,双方友好协商,如不能达成一致意见,可向法院起诉,费用由败诉方承担,本合同传真件有法律效力。</textarea>
        </div>
        <div class="mb10">
          <label>备注:</label>
          <textarea type="text" id="note" class="ui-input ui-input-ph"></textarea>
        </div>
   
    
      <ul class="c999 cf">
        <li>
          <label>制单人:</label>
          <span id="userName"></span>
        </li>
        <li>
          <label>审核人:</label>
          <span id="checkName"></span>
        </li>
        <li>
          <label>录单时间:</label>
          <span id="createTime"></span>
        </li>
        <li>
          <label>最后修改时间:</label>
          <span id="modifyTime"></span>
        </li>
      </ul>
    </div>
    <div class="cf" id="bottomField">
    	<div class="fr" id="toolBottom"></div>
    </div>
    <div id="mark"></div>
  </div>
  
  <div id="initCombo" class="dn">
    <input type="text" class="textbox goodsAuto" name="goods" autocomplete="off">
    <input type="text" class="textbox storageAuto" name="storage" autocomplete="off">
    <input type="text" class="textbox unitAuto" name="unit" autocomplete="off">
    <input type="text" class="textbox priceAuto" name="price" autocomplete="off">
    <input type="text" class="textbox skuAuto" name="price" autocomplete="off">
  </div>
  <div id="storageBox" class="shadow target_box dn">
  </div>
</div>
<script src="<?php echo base_url()?>statics/js/dist/salesOrder.js?ver=201510141132"></script>
</body>
</html>