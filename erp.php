<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class InvTfout extends CI_Controller {

    public function __construct(){
        parent::__construct();
		$this->common_model->checkpurview();
		$this->jxcsys = $this->session->userdata('jxcsys');
    }


	public function index() {
	    $action = $this->input->get('action',TRUE);
		switch ($action) {
			case 'initTf':
			    $this->common_model->checkpurview(145);
			    $this->load->view('scm/invTf/initTf');	
				break;  
			case 'editTf':
			 //   $this->common_model->checkpurview(144);
			    $this->load->view('scm/invTf/initTf');	
				break;
			case 'invTfoutList':
				//出库库列表 by missxue
				$this->common_model->checkpurview(18);
				$this->load->view('scm/invTfout/invTfoutList');
				break;
			case 'wllist':
				//物流 by missxue
				$this->common_model->checkpurview(210);
				// var_dump(222);
				$this->load->view('scm/invTfout/wllist');
				break;	
			case 'wldetail':
				//详情
				$data=$this->input->get(NULL,TRUE);				
				// $this->common_model->checkpurview(144);
				$this->load->view('scm/invTfout/wldetail',$data);	
				break; 
			case 'wlhd':
				//核对物流页面
				// $this->common_model->checkpurview(144);
				$data=$this->input->get(NULL,TRUE);	
				$this->load->view('scm/invTfout/wlhd',$data);	
				break; 	
			case 'invTfoutDetail':
				//详情
				$data=$this->input->get(NULL,TRUE);				
				// $this->common_model->checkpurview(144);
				$this->load->view('scm/invTfout/invTfoutDetail',$data);	
				break; 
			case 'invTfoutnoManage':
				// 更改提货单编码
				// $this->common_model->checkpurview(144);
				$data=$this->input->get(NULL,TRUE);	
				$this->load->view('scm/invTfout/invTfoutnoManage',$data);	
				break; 
			case 'invTfoutManage':
				// 出库操作页面
				// $this->common_model->checkpurview(144);
				$data=$this->input->get(NULL,TRUE);	
				$this->load->view('scm/invTfout/invTfoutManage',$data);	
				break; 			
			case 'initTfList':
			 //   $this->common_model->checkpurview(144);
			    $this->load->view('scm/invTf/initTfList');
				break; 
			
				//storage
			case 'tpinfo':
				//托盘 信息by missxue
				// $this->common_model->checkpurview(144);
				$this->load->view('scm/invTfout/tpinfo');
				break;	
				//storage	
			default: 
			 //   $this->common_model->checkpurview(144); 
			    $this->tfList();	
		}
	}

	//wllist

	// 托盘分配信息
	public function tpinfolistTf()
	{
		# code...	
		$data=$this->input->post(NULL,TRUE);	
		$id=$data['id'];
		$where = " a.tpdatano='{$id}'"; 
		$data=$this->data_model->get_tp_out_info($where.' order by a.id asc '); //托盘重量
// 		echo $this->db->last_query();
		if($data){
			str_alert(200,'success',$data);
		}else{
			str_alert(-1,'暂无托盘信息，请填写以后再来查看'); 
		}
		
	}

	public function manage(){
		$data=$this->input->post(NULL,TRUE);		
// 		$datalist =  $this->data_model->get_order('a.isDelete=0 and a.id='.$data['id'],1);	
		$datalist =  $this->mysql_model->get_rows('order',array("isDelete"=>0,"id"=>$data['id']));	
		if(count($datalist)==0){	str_alert(-1,'采购合同编号有误');}
		$iid			 =$data['id'];
		$v['iid']        = $iid;		
		$v['billNo']     = $data['billNo'];	
		$v['modifytime']=date("Y-m-d H:i:s");
		$outorderNo=trim($data['b_value']);		
		$data1    = $this->mysql_model->get_rows('order_out','(isDelete=0) and outorderNo="'.$outorderNo.'" and (iid<>'.$iid.')');
		if(count($data1)>0){
			str_alert(-1,'出库单号：'.$outorderNo.'已经存在');
		}
		
		
		
		$v['outorderNo']  =$outorderNo;
		$sort=intval(substr($data['b_value'],-4));
		$lengt=strlen($sort);
		
		$v['sort']=$sort;
		$info = elements(array('outorderNo','modifytime','sort'),$v,NULL);
		$data_bginfo     = $this->mysql_model->get_rows('order_out','(isDelete=0) and (iid = '.$iid.')');
		if (count($data_bginfo)>0) {
			if($data_bginfo['status']>0){
				str_alert(-1,'已经出库不能在修改出库单号');
			}
			if($outorderNo!=$data_bginfo['outorderNo']){
				//提交过
				// $v['uid']             = $data_bginfo[0]['uid'];
				// $v['userName']        = $data_bginfo[0]['userName'];					
				$this->mysql_model->update('order_out',$info,array('iid'=>$iid));
				$v['id']=$data_bginfo[0]['id'];
			}
			
		}else{
			// $v['uid']             = $this->jxcsys['uid'];
			// $v['userName']        = $this->jxcsys['name'];
			$v['createtime']=date("Y-m-d H:i:s");
			$id = $this->mysql_model->insert('order_out',$v);   
			$v['id']=$id;
		}
		$v['value']=$data['b_value'];
		str_alert(200,'success',$v);
	}

	
	public function finishwl(){
		$data=$this->input->post(NULL,TRUE);	
		$iid	  =$data['id'];	
		$wl_type=trim($data['type']);
		$uid          = $this->jxcsys['uid'];
		$userName     = $this->jxcsys['name'];

		$datalist =  $this->data_model->get_order_out('a.isDelete=0 and a.id='.$iid,1);	
		
		if(count($datalist)==0){	str_alert(-1,'销售合同编号有误');}
		if($datalist['status']==2){
			str_alert(-1,'该合同已经全部出库，不可以重复操作');
		}
// 		$data2= $this->mysql_model->get_results('order_wl_info','(isDelete=0) and (iid in('.$iid.'))');
			
			
		$v['iid']        = $iid;		
		$v['billNo']     = $datalist['billNo'];	
		$v['outorderNo'] = $datalist['outorderNo'];	
		$v['uid']          = $uid;
		$v['userName']     = $userName;
		$v['createtime']=date("Y-m-d");
		$v['type']     	 = $wl_type;
		$v['createtime']=date("Y-m-d");
		if($wl_type=='自提'){
			$v['ycarno']     = $data['selfcarno'];	
			$v['selfcarno']    = $data['selfcarno'];
			$v['wlcompanyName']= $wl_type;
			$v['ymoney']     = 0;	
		}else{

			$v['yperson']    = $data['yperson'];	
			$v['ycarno']     = $data['ycarno'];	
			$v['ymoney']     = $data['ymoney'];					
			$v['wlcompany']  = $data['wlcompany'];	
			$v['wlcompanyName']= $data['wlcompanyName'];
		}


	    $data_info=$this->mysql_model->get_results("order_info_out",'(isDelete=0) and (iid in('.$iid.'))');	

		$this->db->trans_begin();	
		
		$this->mysql_model->delete('order_wl_info',array('iid'=>$iid));	
		$id = $this->mysql_model->insert('order_wl_info',$v);
			
	
		$this->invso_info($iid,$data_info);
		$this->mysql_model->update('order_out',['status'=>2,'statusvalue'=>'全部出库','uid'=>$uid,'username'=>$userName],array('iid'=>$iid));
		$this->mysql_model->update('order_info_out_tp',['status'=>2],array('iid'=>$iid));
		//echo $this->db->last_query();

		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			str_alert(-1,'SQL错误或者提交的是空数据'); 
		} else {
			$this->db->trans_commit();			
			$v['statusvalue']='全部出库';	
			$v['status']=2;	
			str_alert(200,'success',$v);
		}
		

	}

	//调拨单出库
	public function finishwldb(){
		$data=$this->input->post(NULL,TRUE);	
		$iid	  =$data['id'];			
		$uid          = $this->jxcsys['uid'];
		$userName     = $this->jxcsys['name'];
		$wl_type=trim($data['type']);

		$datalist =  $this->data_model->get_order_out('a.isDelete=0 and a.id='.$iid,1);	
		if(!$datalist){	str_alert(-1,'销售合同编号有误');}
		if($datalist['status']==2){
			str_alert(-1,'该调拨单全部出库，不可以重复操作');
		}
		$transType=intval($datalist['transType']);
		
		$v['iid']        = $iid;		
		$v['billNo']     = $datalist['billNo'];	
		$v['outorderNo'] = $datalist['billNo'];	
		$v['uid']          = $uid;
		$v['userName']     = $userName;
		$v['createtime']=date("Y-m-d");
		$v['type']     	 = $wl_type;
		if($wl_type=='自提'){
			$v['ycarno']     = $data['selfcarno'];	
			$v['selfcarno']    = $data['selfcarno'];
			$v['wlcompanyName']= $wl_type;
			$v['ymoney']     = 0;	
		}else{

			$v['yperson']    = $data['yperson'];	
			$v['ycarno']     = $data['ycarno'];	
			$v['ymoney']     = $data['ymoney'];					
			$v['wlcompany']  = $data['wlcompany'];	
			$v['wlcompanyName']= $data['wlcompanyName'];
		}
		
	
// 		$data_info=$this->mysql_model->get_results("order_info_out",'(isDelete=0) and (iid in('.$iid.'))');//调拨详情
// 		var_dump($data_info);
// 		die;
			
		
		$this->db->trans_begin();	
		//物流表插入数据
		$this->mysql_model->delete('order_wl_info',array('iid'=>$iid));			
		$id = $this->mysql_model->insert('order_wl_info',$v);//物流信息id

	
		$data_info=$this->mysql_model->get_results("order_info_out",'(isDelete=0) and (iid in('.$iid.'))');//调拨详情
// 		var_dump($data_info);
// 		die;
		$this->invso_info($iid,$data_info,$transType);
		
		//对方仓库入库操作

		$this->mysql_model->update('order_out',['status'=>2,'statusvalue'=>'全部出库','uid'=>$uid,'username'=>$userName],array('iid'=>$iid));
		$this->mysql_model->update('order',['checked'=>1,'checkName'=>$userName],array('id'=>$iid));
		$this->mysql_model->update('order_info_out_tp',['status'=>2],array('iid'=>$iid));
		//echo $this->db->last_query();

		//入库信息
	    $invoice_data=array(
			'billNo'=>$datalist['billNo'],
			'uid'=>$datalist['uid'],
			'userName'=>$datalist['userName'],
			'transType'=>$datalist['transType'],
			'totalAmount'=>$datalist['totalAmount'],
			'moneytype'=>$datalist['moneytype'],
			'billDate'=>$datalist['billDate'],
			'description'=>$datalist['description'],
			'totalQty'=>$datalist['totalQty'],
			'billStatus'=>9,
			'checkName'=>$userName,
			'createTime'=>date("Y-m-d H:i:s"),
			'checked'=>1,
			'billType'=>$datalist['billType'],
			'transTypeName'=>$datalist['transTypeName'],
			'locationId'=>$datalist['inLocationId'],
			'inLocationId'=>$datalist['inLocationId'],
			'outLocationId'=>$datalist['outLocationId'],
			'dataType'=>$datalist['dataType'],
			'inno'=>$datalist['billNo'],
			'orderid'=>$iid,
		);
		$invoice_id = $this->mysql_model->insert('invoice',$invoice_data);//物流信息id
		$this->invpu_info($invoice_id,$data_info,$datalist['inLocationId']);

		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			str_alert(-1,'SQL错误或者提交的是空数据'); 
		} else {
			$this->db->trans_commit();			
			$v['statusvalue']='全部出库';	
			$v['status']=2;	
			str_alert(200,'success',$v);
		}
		

	}
	public function wldetail(){
		$id  = trim($this->input->get_post('id',TRUE));

		$data=$this->mysql_model->get_rows('order_wl_info','(id='.$id.')');
		if (count($data)>0) {
			$json['status']                 = 200;
			$json['msg']                    = 'success';
			$json['data']                    = $data;
			die(json_encode($json));
		}
		str_alert(-1,'信息不存在'); 
	}

	//finishhdwl
	public function finishhdwl(){
		$id  = trim($this->input->get_post('id',TRUE));
		$hdmoney = trim($this->input->get_post('hdmoney',TRUE));
		$info=array('ymoney'=>$hdmoney,'status'=>1,'id'=>$id);
		$res=$this->mysql_model->update('order_wl_info',$info,array('id'=>$id));
		if($res){
			$json['status']                 = 200;
			$json['msg']                    = 'success';
			$json['data']                    = $info;
			die(json_encode($json));			
		}else{
			str_alert(-1,'核对失败');
		}
	
		 
	}
	//物流列表
	public function wllistdata(){
		$page = max(intval($this->input->get_post('page',TRUE)),1);
		$rows = max(intval($this->input->get_post('rows',TRUE)),100);
		$matchCon  = str_enhtml($this->input->get_post('matchCon',TRUE));
		$beginDate = str_enhtml($this->input->get_post('beginDate',TRUE));
		$endDate   = str_enhtml($this->input->get_post('endDate',TRUE));
		$where = 'wl.isDelete=0'; 
		$where .= $matchCon  ? ' and (wl.wlcompanyName like "%'.$matchCon.'%" or wl.outorderNo like "%'.$matchCon.'%" or wl.billNo like "%'.$matchCon.'%" or wl.yperson like "%'.$matchCon.'%")' : ''; 
		$where .= $beginDate ? ' and wl.createtime>="'.$beginDate.'"' : ''; 
		$where .= $endDate ? ' and wl.createtime<="'.$endDate.'"' : ''; 
		$where .= $this->common_model->get_admin_purview();
		$list = $this->data_model->get_order_wl($where.' order by id desc limit '.$rows*($page-1).','.$rows);  
		foreach ($list as $k=>$v){
		    $list[$k]['wlcompanyName']=$v['wlcompanyj'];
		    $list[$k]['contactName']=$v['contactjName'];
		}
		
		$json['status'] = 200;
		$json['msg']    = 'success'; 
		$json['data']['page']      = $page;
		$json['data']['records']   = $this->data_model->get_order_wl($where,3);   
		$json['data']['total']     = ceil($json['data']['records']/$rows);      
		$json['data']['rows']      = isset($list) ? $list : array();
		die(json_encode($json));
	}
	// 物流导出数据
	public function exportwl(){
		// $this->common_model->checkpurview(148);
		$name = '货物运输列表_'.date('YmdHis').'.xls';
		sys_csv($name);
		$this->common_model->logs('导出货物运输列表单据:'.$name);
		$transType = intval($this->input->get_post('transType',TRUE));
		// $matchCon  = str_enhtml($this->input->get_post('matchCon',TRUE));
		$beginDate = str_enhtml($this->input->get_post('beginDate',TRUE));
		$endDate   = str_enhtml($this->input->get_post('endDate',TRUE));
		$where = 'wl.isDelete=0'; 
		$where .= $beginDate ? ' and wl.createtime>="'.$beginDate.'"' : ''; 
		$where .= $endDate ? ' and wl.createtime<="'.$endDate.'"' : ''; 
		$where .= $this->common_model->get_admin_purview();                               
		$list = $this->data_model->get_order_wl($where.' order by a.id desc'); 
		// echo '<pr>';
		// var_dump($list);
		$data['list']        = $list ? $list : array();
		$this->load->view('scm/invTfout/exportwl',$data);
	}

	//出库列表
	public function tfList(){
		$page = max(intval($this->input->get_post('page',TRUE)),1);
		$rows = max(intval($this->input->get_post('rows',TRUE)),100);
		$matchCon  = str_enhtml($this->input->get_post('matchCon',TRUE));
		$beginDate = str_enhtml($this->input->get_post('beginDate',TRUE));
		$endDate   = str_enhtml($this->input->get_post('endDate',TRUE));
		$inLocationId    = intval($this->input->get_post('inLocationId',TRUE));
		$outLocationId   = intval($this->input->get_post('outLocationId',TRUE)); 
		$where = 'a.isDelete=0 and a.checked=1 and billStatus>=7 and transType=150601'; 
		$where .= $matchCon  ? ' and a.postData like "%'.$matchCon.'%"' : ''; //stor
		$where .= $matchCon  ? ' and (o.outorderNo like "%'.$matchCon.'%" or con.jname like "%'.$matchCon.'%" or a.billNo like "%'.$matchCon.'%" or stor.jname like "%'.$matchCon.'%")' : ''; 
// 		$where .= $beginDate ? ' and a.billDate>="'.$beginDate.'"' : ''; 
// 		$where .= $endDate ? ' and a.billDate<="'.$endDate.'"' : ''; 
		$where .= $outLocationId>0 ? ' and find_in_set('.$outLocationId.',a.outLocationId)' :'';
		$where .= $inLocationId>0 ? ' and find_in_set('.$inLocationId.',a.inLocationId)' :'';
// 		$where .= $this->common_model->get_admin_purview();
		$list = $this->data_model->get_order_out($where.' order by a.id desc limit '.$rows*($page-1).','.$rows);  
// 		echo $this->db->last_query();
        foreach ($list as $k=>$v){
            $list[$k]['totalQty']=abs($v['totalQty'])*1000;
        }
		
		$json['status'] = 200;
		$json['msg']    = 'success'; 
		$json['data']['page']      = $page;
		$json['data']['records']   = $this->data_model->get_order_out($where,3);   
		$json['data']['total']     = ceil($json['data']['records']/$rows);      
		$json['data']['rows']      = isset($list) ? $list : array();
		die(json_encode($json));
	}
	//导出出库列表
	public function exportinvTfout(){
		// $this->common_model->checkpurview(148);
		$name = '出库单列表_'.date('YmdHis').'.xls';
		sys_csv($name);
		$this->common_model->logs('导出出库单据:'.$name);
		$transType = intval($this->input->get_post('transType',TRUE));
		$matchCon  = str_enhtml($this->input->get_post('matchCon',TRUE));
		$beginDate = str_enhtml($this->input->get_post('beginDate',TRUE));
		$endDate   = str_enhtml($this->input->get_post('endDate',TRUE));
		$where = 'a.isDelete=0 and a.checked=1 and billStatus>=7 '; 
		$where .= $transType ? ' and a.transType='.$transType : ''; 
		// $where .= $matchCon  ? ' and (a.postData like "%'.$matchCon.'%")' : ''; 
		// $where .= $matchCon  ? ' and (c.name like "%'.$matchCon.'%" or b.name like "%'.$matchCon.'%" or a.billNo like "%'.$matchCon.'%")' : ''; 
		$where .= $beginDate ? ' and a.billDate>="'.$beginDate.'"' : ''; 
		$where .= $endDate   ? ' and a.billDate<="'.$endDate.'"' : ''; 
		$where .= $this->common_model->get_admin_purview();                               
		$list = $this->data_model->get_export_order_out($where.' order by a.id asc'); 
		// echo $this->db->last_query();
		
		// $json['status']              = 200;
		// $json['msg']                 = 'success'; 
		// $json['data']['page']        = $page;
		// $json['data']['records']     = $this->data_model->get_invoice_inpre($where,3);                             
		// $json['data']['total']       = ceil($json['data']['records']/$rows);
		$data['list']        = $list ? $list : array();
		// die(json_encode($json));
		$this->load->view('scm/invTfout/exportinvTfout',$data);
	}
	
	
	public function query() {
	   // $this->common_model->checkpurview(144);
	    $id   = intval($this->input->get_post('id',TRUE));
		
		$where = 'a.isDelete=0 and a.id='.$id; 
		$data =$this->data_model->get_order_out($where.' group by a.id order by a.id desc');
		// echo $this->db->last_query();
		
		if (count($data)>0) {
			$uid          = $this->jxcsys['uid'];
			$userName     = $this->jxcsys['name'];
			$json['status']                 = 200;
			$json['msg']                    = 'success'; 
			$json['data']['id']             = intval($data[0]['id']);
			$json['data']['date']           = $data[0]['billDate'];
			$json['data']['billNo']         = $data[0]['billNo'];
			$json['data']['totalQty']       = (float)$data[0]['totalQty']; 
			$json['data']['description']    = $data[0]['description'];
			$json['data']['userName']       = $userName; 
			$json['data']['status']         = intval($data[0]['checked'])==1 ? 'view' : 'edit'; 
			$json['data']['checked']        = intval($data[0]['checked']); 
			$json['data']['checkName']      = $data[0]['checkName']; 
			$json['data']['createTime']     = $data[0]['createTime']; 
			$json['data']['modifyTime']     = $data[0]['modifyTime']; 
			$json['data']['locationId']    = $data[0]['locationId']; 
			$json['data']['locationName']    = $data[0]['locationName']; 
			$json['data']['description']    = $data[0]['description']; 
			$json['data']['orderNo']    = $data[0]['outorderNo']; //wlcompany
			$json['data']['wlcompany']    = intval($data[0]['wlcompany']); //wlcompany
			$json['data']['wlcompanyName']    = $data[0]['wlcompanyName'];
			$json['data']['yperson']    = $data[0]['yman'];
			$json['data']['ycarno']    = $data[0]['ycarno'];
			$json['data']['ymoney']    = $data[0]['ymoney'];
			$json['data']['type']    = $data[0]['wltype'];
			$json['data']['selfcarno']    = $data[0]['selfcarno'];
			die(json_encode($json));
		}
		str_alert(-1,'单据不存在'); 
    }
	
	

	
	
	


	// 导出出库单电子版
	public function exportoutlist(){
		$id   = intval($this->input->get_post('id',TRUE));
		$name = '出库单'.date('YmdHis').'.xls';
		sys_csv($name);
		// $this->common_model->logs('导出采购境外合同:'.$name);

		$data =  $this->data_model->get_order_out('a.isDelete=0 and a.id='.$id,1);
		if (count($data)==0) {
			str_alert(-1,'暂无出库数据'); 
		}
		$list = $this->data_model->get_order_info('a.isDelete=0 and a.iid='.$id);  
		foreach ($list as $arr=>$row) {
			$v[$arr]['goods']               = $row['invName'].''.$row['trademark'].' '.$row['barCode'];
			$v[$arr]['invName']             = $row['invName'];
			$v[$arr]['trademark']           = $row['trademark'];
			$v[$arr]['qualitygradeName']    = $row['qualitygradeName'];
			$v[$arr]['trademark']    		= $row['trademark'];
			$v[$arr]['barCode']             = $row['barCode'];
			$v[$arr]['qty']                 = number_format(abs($row['qty']),3);
			$v[$arr]['amount']              = number_format(abs($row['amount']),2,'.',',');
			$v[$arr]['price']              = number_format(abs($row['price']),2,'.',',');
			$v[$arr]['totalAmount']         = number_format(abs($row['totalAmount']),'.',',');
			$v[$arr]['mainUnit']            = $row['mainUnit'];
			$v[$arr]['invId']               = intval($row['invId']);
			$v[$arr]['qtp']           		= intval($row['qtp']);
			$v[$arr]['tplist']=$this->data_model->get_order_ckd("a.tpdatano='{$row['tpdatano']}'");
		}
		$data['entries']            = isset($v) ? $v : array();
		$data['goods']            = $good_arr;
		$data['totaltp']=$num;
		$data['totalQty']=number_format($data['totalQty']*1000,3,'.',',');
		$data['system']=$this->common_model->get_option('system'); 
		$data['sellinfo']=$this->mysql_model->get_rows('contact',array('id'=>$data['buId']));
		
		if(!empty($data['ymoney'])){
		    $data['dymoney']=$this->convertAmountToCn($data['ymoney']);
		}
		
		$this->load->view('scm/invTfout/exportoutlist',$data);	

	}

//导出运费单
	public function exportoutyf(){
		$id   = intval($this->input->get_post('id',TRUE));
		$name = '运费单'.date('YmdHis').'.xls';
		sys_csv($name);
		// $this->common_model->logs('导出采购境外合同:'.$name);

		$data =  $this->data_model->get_order_out('a.isDelete=0 and a.id='.$id,1);
		// echo $this->db->last_query();
		if (count($data)==0) {
			str_alert(-1,'暂无出库数据'); 
		}
		$list = $this->data_model->get_order_info('a.isDelete=0 and a.iid='.$id);  
		$num=0;
		// $totalQty=0;
		// $totalAmount=0;
		$array=array();
		$good_arr=[];
		$array_tp=array();
		$good_arr_tp=[];
		foreach ($list as $arr=>$row) {
			$v[$arr]['invSpec']             = $row['invSpec'];
			$v[$arr]['srcOrderEntryId']     = $row['srcOrderEntryId'];
			$v[$arr]['srcOrderNo']          = $row['srcOrderNo'];
			$v[$arr]['srcOrderId']          = $row['srcOrderId'];
			$v[$arr]['goods']               = $row['invNumber'].' '.$row['invName'].''.$row['trademark'].' ['.$row['invSpec']."][".$row['barCode']."][".$row['qualitygradeName']."]";
			$v[$arr]['invName']             = $row['invName'];
			$v[$arr]['trademark']           = $row['trademark'];
			$v[$arr]['qualitygradeName']    = $row['qualitygradeName'];
			$v[$arr]['trademark']    		= $row['trademark'];
			$v[$arr]['barCode']             = $row['barCode'];
			$v[$arr]['qty']                 = (float)abs($row['qty']);
			$v[$arr]['amount']              = (float)abs($row['amount']);
			$v[$arr]['totalAmount']         = (float)abs($row['totalAmount']);
			$v[$arr]['totalQty']            = (float)abs($row['totalQty']);
			$v[$arr]['price']               = (float)$row['price'];
			$v[$arr]['mainUnit']            = $row['mainUnit'];
			$v[$arr]['invId']               = intval($row['invId']);
			$v[$arr]['qtp']           		= intval($row['qtp']);
			$v[$arr]['tpid']           		= $row['tpid'];
			$v[$arr]['tpno']           		= $row['tpno'];
			$v[$arr]['tpsort']           		= $row['tpsort'];
			$v[$arr]['inbillNo']           		= $row['inbillNo'];
			$v[$arr]['totalQtp']           = intval($row['totalQtp']);//tp.tpno,tp.tpsort,tp.billNo as inbillNo
			$num=$num+intval($row['totalQtp']);
			$totalQty=(float)abs($row['totalQty'])+$totalQty;
			$totalAmount=(float)abs($row['totalAmount'])+$totalAmount;
			if(!in_array($row['invNumber'],$array)){
				array_push($array,$row['invNumber']);
				$good_arr[$row['invNumber']]['invName']=$row['invName'];
				$good_arr[$row['invNumber']]['trademark']=$row['trademark'];
				$good_arr[$row['invNumber']]['barCode']=$row['barCode'];
				$good_arr[$row['invNumber']]['inbillNo']=$row['inbillNo'];
			}			
			if(!in_array($row['tpid'],$array_tp)){
				array_push($array_tp,$row['tpid']);
				$good_arr[$row['invNumber']]['tp'][$row['tpid']]['tpid']=$row['tpid'];
				$good_arr[$row['invNumber']]['tp'][$row['tpid']]['tpno']=$row['tpno'];
				$good_arr[$row['invNumber']]['tp'][$row['tpid']]['tpsort']=$row['tpsort'];
				$good_arr[$row['invNumber']]['tp'][$row['tpid']]['qty']=(float)abs($row['qty']);
				
			}
			// $good_arr[$row['invNumber']]['tp']['count']=count($good_arr[$row['invNumber']]['tp']);
		}
		// $data['totalQty']=$totalQty;
		// $data['totalAmount']=$totalAmount;
		$data['entries']            = isset($v) ? $v : array();
		$data['goods']            = $good_arr;
		$data['totaltp']=$num;
		$data['system']=$this->common_model->get_option('system'); 
		$data['sellinfo']=$this->mysql_model->get_rows('contact',array('id'=>$data['buId']));
		
		$this->load->view('scm/invTfout/exportoutyf',$data);	

	}
	
 

	

	//待入库信息 by missxue
	public function detail() {
	   // $this->common_model->checkpurview(144);
	    $id   = intval($this->input->get_post('id',TRUE));
		$where1 = "a.id={$id} and isDelete=0 "; 
		$data=$this->data_model->get_order_out($where1.' group by a.id order by a.id desc limit 1 ');
		
		if (count($data)>0) {
			$data=$data[0];
			$where = 'a.isDelete=0 and a.iid='.$id; 
			$postData =$this->data_model->get_order_info_out($where.' group by a.id order by a.id desc');
		    foreach ($postData as $arr=>$row) {
				$v[$arr]['id']           = intval($row['id']);
				$v[$arr]['infoid']           = intval($row['id']);
				$v[$arr]['invId']           = intval($row['invId']);
				$v[$arr]['invNumber']       = $row['invNumber'];
				$v[$arr]['invSpec']         = $row['invSpec'];
				$v[$arr]['invName']         = $row['invName'];
				$v[$arr]['unitName']         = $row['unitName'];
				$v[$arr]['goods'] =$row['invName'].' '.$row['trademark'].' '.$row['barCode'];
				$v[$arr]['qty']             = (float)abs($row['qty'])*1000;
				$v[$arr]['mainUnit']        = $row['mainUnit'];
				$v[$arr]['unitId']          = intval($row['unitId']);
				$v[$arr]['package']   = $row['package'];
				$v[$arr]['repackage']   = $row['repackage'];
				$v[$arr]['qtp']   = $row['qtp'];
				$v[$arr]['statusvalue']   = $row['statusvalue'];
				$v[$arr]['outLocationName'] = $row['outLocationName'];
				$v[$arr]['tpno'] = $row['tpno'];
				$v[$arr]['tpid'] = $row['tpid'];
				$v[$arr]['sy'] = $row['sy'];
				$v[$arr]['tpdatano'] = $row['tpdatano'];
			}
			$uid          = $this->jxcsys['uid'];
			$userName     = $this->jxcsys['name'];
			$json['status']                 = 200;
			$json['msg']                    = 'success'; 
			$json['data']['id']             = intval($data['id']);
			$json['data']['date']           = $data['billDate'];
			$json['data']['billNo']         = $data['billNo'];
			$json['data']['outsort']         = $data['outsort'];
			$json['data']['totalQty']       = (float)$data['totalQty']*1000; 
			$json['data']['description']    = $data['description'];
			$json['data']['userName']       = $userName; 
			$json['data']['status']         = intval($data['checked'])==1 ? 'view' : 'edit'; 
			$json['data']['checked']        = intval($data['checked']); 
			$json['data']['checkName']      = $data['checkName']; 
			$json['data']['createTime']     = date("Y-m-d",strtotime($data['createTime'])); 
			$json['data']['modifyTime']     = $data['modifyTime']; 
			$json['data']['locationId']    = $data['locationId']; 
			$json['data']['locationName']    = $data['locationName']; 
			$json['data']['description']    = $data['description']; 
			$json['data']['orderNo']    = $data['outorderNo']; //outusername
			$json['data']['outusername']    = $data['outusername']; //outusername
			$json['data']['entries']        = isset($v) ? $v : array();
			die(json_encode($json));
		}
		str_alert(-1,'单据不存在'); 
    }

	

	//打印
    public function toPdf() {
	   // $this->common_model->checkpurview(179);
	    $id   = intval($this->input->get('id',TRUE));
		$data = $this->data_model->get_invoice('a.id='.$id.' and a.transType=103091',1);  
		if (count($data)>0) { 
			$data['num']    = 53;
			$data['system'] = $this->common_model->get_option('system'); 
			$postData = unserialize($data['postData']);
		    foreach ($postData['entries'] as $arr=>$row) {
			    $v[$arr]['i']               = $arr + 1;
				$v[$arr]['invId']           = intval($row['invId']);
				$v[$arr]['invNumber']       = $row['invNumber'];
				$v[$arr]['invSpec']         = $row['invSpec'];
				$v[$arr]['invName']         = $row['invName'];
				$v[$arr]['goods']           = $row['invNumber'].' '.$row['invName'].' '.$row['invSpec'];
				$v[$arr]['qty']             = (float)abs($row['qty']);
				$v[$arr]['mainUnit']        = $row['mainUnit'];
				$v[$arr]['unitId']          = intval($row['unitId']);
				$v[$arr]['inLocationId']    = $row['inLocationId'];
				$v[$arr]['inLocationName']  = $row['inLocationName'];
				$v[$arr]['outLocationId']   = $row['outLocationId'];
				$v[$arr]['outLocationName'] = $row['outLocationName'];
			}
			$data['countpage']  = ceil(count($postData['entries'])/$data['num']); ;   
			$data['list']       = isset($v) ? $v : array();
			ob_start();
			$this->load->view('scm/invTf/toPdf',$data);
			$content = ob_get_clean();
			require_once('./application/libraries/html2pdf/html2pdf.php');
			try {
			    $html2pdf = new HTML2PDF('P', 'A4', 'en');
				$html2pdf->setDefaultFont('javiergb');
				$html2pdf->pdf->SetDisplayMode('fullpage');
				$html2pdf->writeHTML($content, '');
				$html2pdf->Output('invTf_'.date('ymdHis').'.pdf');
			}catch(HTML2PDF_exception $e) {
				echo $e;
				exit;
			}  	  
		} 
		str_alert(-1,'单据不存在、或者已删除');   
	}
	

	
	//公共验证
	private function validform($data) {
	    $data['id']              = isset($data['id']) ? intval($data['id']) : 0;
		$data['totalQty']        = (float)$data['totalQty']; 
		$data['billType']        = 'TRANSFER';
		$data['transType']       = 103091;
		$data['transTypeName']   = '调拨单';
		$data['billDate']        = $data['date'];
		$data['description']     = $data['description'];
		$data['uid']             = $this->jxcsys['uid'];
		$data['userName']        = $this->jxcsys['name'];
		$data['modifyTime']      = date('Y-m-d H:i:s');
		$data['createTime']      = $data['modifyTime'];
		$data['accounts']        = isset($data['accounts']) ? $data['accounts'] : array();
		$data['entries']         = isset($data['entries']) ? $data['entries'] : array();
		
		count($data['entries']) < 1 && str_alert(-1,'提交的是空数据'); 
		
		if ($data['id']>0) {
		    $invoice = $this->mysql_model->get_rows('invoice',array('id'=>$data['id'],'transType'=>103091,'isDelete'=>0));  
			count($invoice)<1 && str_alert(-1,'单据不存在、或者已删除');
			$data['checked'] = $invoice['checked'];	
			$data['billNo']  = $invoice['billNo'];	
		} else {
		    $data['billNo']  = str_no('DB');    
		}
		
	    //商品录入验证
		$system    = $this->common_model->get_option('system'); 
		if ($system['requiredCheckStore']==1) {
		    $inventory = $this->data_model->get_invoice_info_inventory();
		}

		$storage   = array_column($this->mysql_model->get_results('storage','(disable=0)'),'id');  
		foreach ($data['entries'] as $arr=>$row) {
			(float)$row['qty'] < 0 && str_alert(-1,'商品数量要为数字，请输入有效数字！'); 
			intval($row['outLocationId']) < 1 && str_alert(-1,'请选择调出仓库仓库！'); 
			intval($row['inLocationId']) < 1  && str_alert(-1,'请选择调入仓库仓库！'); 
			intval($row['outLocationId']) == intval($row['inLocationId']) && str_alert(-1,'调出仓库不能与调入仓库相同！'); 
			!in_array($row['outLocationId'],$storage) && str_alert(-1,$row['outLocationName'].'不存在或不可用！');
			!in_array($row['inLocationId'],$storage) && str_alert(-1,$row['inLocationName'].'不存在或不可用！');
				
			//库存判断 修改不验证
			if ($system['requiredCheckStore']==1 && $data['id']<1) {  
				if (isset($inventory[$row['invId']][$row['outLocationId']])) {
					$inventory[$row['invId']][$row['outLocationId']] < (float)$row['qty'] && str_alert(-1,$row['outLocationName'].$row['invName'].'商品库存不足！'); 
				} else {
					str_alert(-1,$row['invName'].'库存不足！');
				}
			}
			$inLocationId[]  = $row['inLocationId'];
			$outLocationId[] = $row['outLocationId'];
		} 
		$data['inLocationId']  = join(',',array_unique($inLocationId));
		$data['outLocationId'] = join(',',array_unique($outLocationId));
		$data['postData'] = serialize($data);
		return $data;	
	} 
	
	
	
		public function invoice_info(){
			//往仓库表中添加数据
			$insert_data=array(
				'iid'=>$id,
				'inid'=>$info_data['iid'],
				'buId'=>$info_data['buId'],
				'billNo'=>$info_data['billNo'],
				'transType'=>$info_data['transType'],
				'amount'=>$weight*$info_data['price'],//小计
				'billDate'=>$info_data['billDate'],
				'serialno'=>$info_data['serialno'],
				'sellerno'=>$info_data['sellerno'],
				'description'=>$info_data['description'],
				'invId'=>$info_data['invId'],
				'price'=>$info_data['price'],
				'deduction'=>$info_data['deduction'],
				'qty'=>$weight,
				'locationId'=>$info_data['locationId'],
				'unitId'=>$info_data['unitId'],
				'uid'=>$this->jxcsys['uid'],
				'username'=>$this->jxcsys['name'],
				'entryId'=>$info_data['entryId'],
				'transTypeName'=>$info_data['transTypeName'],
				'billType'=>$info_data['billType'],
				'salesId'=>$info_data['salesId'],
				'isDelete'=>0,
				'package'=>$info_data['package'],
				'repackage'=>$info_data['repackage'],
				'qtp'=>$qtp,
				'status'=>$status,
				'statusvalue'=>$statusvalue,
			);
		}
		//组装数据
		private function invso_info($iid,$data,$transType=150601) {
			$tpid='';
			$i=0;
			$pa_arr=array();
			foreach ($data as $arr=>$row) {
				$v[$arr]['iid']           = $iid;
				$v[$arr]['billNo']        = $row['billNo'];
				$v[$arr]['billDate']      = $row['billDate']; 
				$v[$arr]['buId']          = $row['buId'];
				$v[$arr]['transType']     = $row['transType'];
				$v[$arr]['transTypeName'] = $row['transTypeName'];
				$v[$arr]['billType']      = $row['billType'];
				$v[$arr]['salesId']       = $row['salesId'];
				$v[$arr]['invId']         = intval($row['invId']);
				$v[$arr]['skuId']         = intval($row['skuId']);
				$v[$arr]['unitId']        = intval($row['unitId']);
				$v[$arr]['locationId']    = intval($row['locationId']);
				$v[$arr]['qty']           = -abs($row['qty'])*1000; 
				$v[$arr]['amount']        = -abs($row['amount']); 
				$v[$arr]['price']         = abs($row['price']);  
				$v[$arr]['discountRate']  = $row['discountRate'];  
				$v[$arr]['deduction']     = $row['deduction'];  
				$v[$arr]['description']   = $row['description'];
				$v[$arr]['uid']           = $row['uid'];     
				$v[$arr]['package']       = intval($row['package']);     
				$v[$arr]['repackage']     =intval($row['repackage']);     
				$v[$arr]['qtp']     	   =1;     
				$v[$arr]['tpid']           = $row['tpid'];     
				$v[$arr]['tpno']           = $row['tpno']; 
				$v[$arr]['statusvalue']           = '全部出库'; 
				$v[$arr]['status']           = 2; 
				if(!empty($tpid) && !empty($row['tpid'])){
					$tpid=$tpid.','.$row['tpid'];

				}else{
					$tpid=$row['tpid'];
				}
				//更改托盘的可用数量
				if(!empty($row['repackage'])){
				    $tp_list=$this->mysql_model->get_results("order_info_out_tp",'(iid='.$iid.')');//调拨详情
				   
				    if(count($tp_list)>0){
        		        foreach($tp_list as $a=>$b){
                		    if(intval($b['recovery'])>0){
            			    if (!in_array($b['tpplace'], $pa_arr)){
                                array_push($pa_arr,$b['tpplace']);
                             }
            		    	}
                		}
				    }
				    //  var_dump($pa_arr);
				    //$data_info=$this->mysql_model->get_results("order_info_out",'(isDelete=0) and (iid in('.$iid.'))');//调拨详情		
					$repackage_data[$i]['iid']=$iid;
					$repackage_data[$i]['type']='可回收';
					$repackage_data[$i]['iid']              = $iid;
				// 	$repackage_data[$i]['']
					$repackage_data[$i]['uid']              = $row['uid'];
					$repackage_data[$i]['billNo']           = $row['billNo'];
					$repackage_data[$i]['buId']             = $row['buId']; 
					$repackage_data[$i]['invId']            = intval($row['invId']);
					$repackage_data[$i]['qty']			  =$row['repackage']; 
					$repackage_data[$i]['billType']         = $row['billType'];
					$repackage_data[$i]['transType']        = $row['transType'];
					$repackage_data[$i]['transTypeName']    = $row['transTypeName'];
					$repackage_data[$i]['dataType']         = $row['dataType'];
					$repackage_data[$i]['place']         = !empty($pa_arr)?implode('+',$pa_arr):'';//place
				// 	$repackage_data[$i]['place']         = !empty($pa_arr)?implode('+',$pa_arr):'';//place
					$repackage_data[$i]['create_time']=date('Y-m-d');
					$i++;
				}
			} 
			
			
			if (isset($v)) {
				//$res=$this->mysql_model->get_rows('invoice_info',array('iid'=>$iid,'isDelete'=>0,'transType'=>150601)); 
				if (count($data['iid'])>0) {  					
					if($transType!=103091){
						$this->mysql_model->delete('invoice_info','(iid='.$iid.' and transType=150601)');
						$this->mysql_model->delete('package_list',array('iid'=>$iid,'transType'=>150601));
					}else{
						$this->mysql_model->delete('invoice_info','(iid='.$iid.' and transType=103091)');
					} 
					                 
				}
				
				$this->mysql_model->insert('invoice_info',$v);
				if($transType==103091){
				// 	$sql="update ci_invoice_tp_info as a join ci_invoice_info as b on a.id = b.tpid set a.sy=(a.sy-abs(b.qty)),a.isys=0 where b.iid={$iid} and b.transType=103091";
				// 	$res=$this->db->query($sql);//更新托盘的剩余解库存

				}else{
				
				// 	$sql="update ci_invoice_tp_info as a join ci_invoice_info as b on a.id = b.tpid set a.sy=(a.sy-abs(b.qty)),a.isys=0 where b.iid={$iid} and b.transType=150601";
				// 	$res=$this->db->query($sql);//更新托盘的剩余解库存
				}
				if(!empty($repackage_data)&&$transType!=103091){
				    // var_dump($repackage_data);
				    // if(count($repackage_data)==1){
				    //     $repackage_data=$repackage_data[0];
				    // }
				    // // echo '<pre>';
				    // var_dump($repackage_data);
					$this->mysql_model->insert('package_list',$repackage_data);
				}
			}
		}

		//

		private function invpu_info($iid,$data,$locationid) {
			$repackage_data=array();
			$i=0;
			foreach ($data as $arr=>$row) {
				$v[$arr]['iid']              = $iid;
				$v[$arr]['uid']              = $row['uid'];
				$v[$arr]['billNo']           = $row['billNo'];
				// $v[$arr]['buId']             = $data['buId'];
				$v[$arr]['billDate']         = $row['billDate']; 
				$v[$arr]['billType']         = $row['billType'];
				$v[$arr]['transType']        = $row['transType'];
				$v[$arr]['transTypeName']    = $row['transTypeName'];
				$v[$arr]['invId']            = intval($row['invId']);
				$v[$arr]['skuId']            = intval($row['skuId']);
				$v[$arr]['unitId']           = intval($row['unitId']);
				$v[$arr]['locationId']       = $locationid;
				$v[$arr]['qty']              = $row['transType']==103091 ? abs($row['qty']) :-abs($row['qty']); 
				$v[$arr]['amount']           = $row['transType']==103091 ? abs($row['amount']) :-abs($row['amount']); 
				$v[$arr]['price']            = abs($row['price']);  
				$v[$arr]['discountRate']     = $row['discountRate'];  
				$v[$arr]['deduction']        = $row['deduction'];  
				$v[$arr]['serialno']      = $row['serialno'];
				$v[$arr]['sellerno']      = $row['sellerno'];//供应商合同编号
				$v[$arr]['description']      = $row['description']; 
				$v[$arr]['package']      = $row['package']; 
				$v[$arr]['repackage']      = intval($row['repackage']); 
				$v[$arr]['qtp']      = 1; 
				$v[$arr]['tpdatano']=!empty($row['tpdatano'])?$row['tpdatano']:'';
				$v[$arr]['outinfoid']=!empty($row['id'])?$row['id']:'';
				//outinfoid
				// $v[$arr]['ininvid']
				// $v[$arr]['inbillNo']
				if(!empty($row['repackage'])){
					$repackage_data[$i]['iid']=$iid;
					$repackage_data[$i]['type']='可回收';
					$repackage_data[$i]['iid']              = $iid;
					$repackage_data[$i]['uid']              = $row['uid'];
					$repackage_data[$i]['billNo']           = $row['billNo'];
					$repackage_data[$i]['buId']             = $row['buId']; 
					$repackage_data[$i]['invId']            = intval($row['invId']);
					$repackage_data[$i]['qty']			  =intval($row['repackage']); 
					$repackage_data[$i]['billType']         = $row['billType'];
					$repackage_data[$i]['transType']        = $row['transType'];
					$repackage_data[$i]['transTypeName']    = $row['transTypeName'];
					$repackage_data[$i]['dataType']    = $row['dataType'];
					$i++;
				}
				$data_tp=$this->mysql_model->get_results("order_info_out_tp","(tpdatano ='{$row['tpdatano']}')");//调拨详情
				$v[$arr]['qtp']      =count($data_tp); 
				$v[$arr]['moneytype']      = '元'; 
				if (intval($row['srcOrderId'])>0) {   
					$v[$arr]['srcOrderEntryId']  = intval($row['srcOrderEntryId']);  
					$v[$arr]['srcOrderId']       = intval($row['srcOrderId']);  
					$v[$arr]['srcOrderNo']       = $row['srcOrderNo']; 
				} else {
					$v[$arr]['srcOrderEntryId']  = 0;  
					$v[$arr]['srcOrderId']       = 0;  
					$v[$arr]['srcOrderNo']       = ''; 
				}
			}
			if (isset($v)) {
				if ($data['id']>0) {                     
					$this->mysql_model->delete('invoice_in_info',array('iid'=>$iid));
					$this->mysql_model->delete('package_list',array('iid'=>$iid));
				}
				$this->mysql_model->insert('invoice_in_info',$v);
				if(!empty($repackage_data)){
					$this->mysql_model->insert('package_list',$repackage_data);
				}
				
			}
			
		}
		
		
		 public function convertAmountToCn($amount, $type = 1) {
        // 判断输出的金额是否为数字或数字字符串
        if(!is_numeric($amount)){
            return "要转换的金额只能为数字!";
        }

        // 金额为0,则直接输出"零元整"
        if($amount == 0) {
            return "零元整";
        }

        // 金额不能为负数
        if($amount < 0) {
            return "要转换的金额不能为负数!";
        }

        // 金额不能超过万亿,即12位
        if(strlen($amount) > 12) {
            return "要转换的金额不能为万亿及更高金额!";
        }

        // 预定义中文转换的数组
        $digital = array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        // 预定义单位转换的数组
        $position = array('仟', '佰', '拾', '亿', '仟', '佰', '拾', '万', '仟', '佰', '拾', '元');

        // 将金额的数值字符串拆分成数组
        $amountArr = explode('.', $amount);

        // 将整数位的数值字符串拆分成数组
        $integerArr = str_split($amountArr[0], 1);

        // 将整数部分替换成大写汉字
        $result = '';//前缀
        $integerArrLength = count($integerArr);     // 整数位数组的长度
        $positionLength = count($position);         // 单位数组的长度
        for($i = 0; $i < $integerArrLength; $i++) {
            // 如果数值不为0,则正常转换
            if($integerArr[$i] != 0){
                $result = $result . $digital[$integerArr[$i]] . $position[$positionLength - $integerArrLength + $i];
            }else{
                // 如果数值为0, 且单位是亿,万,元这三个的时候,则直接显示单位
                if(($positionLength - $integerArrLength + $i + 1)%4 == 0){
                    $result = $result . $position[$positionLength - $integerArrLength + $i];
                }
            }
        }

        // 如果小数位也要转换
        if($type == 0) {
            // 将小数位的数值字符串拆分成数组
            $decimalArr = str_split($amountArr[1], 1);
            // 将角替换成大写汉字. 如果为0,则不替换
            if($decimalArr[0] != 0){
                $result = $result . $digital[$decimalArr[0]] . '角';
            }
            // 将分替换成大写汉字. 如果为0,则不替换
            if($decimalArr[1] != 0){
                $result = $result . $digital[$decimalArr[1]] . '分';
            }
        }else{
            $result = $result . '整';
        }
        return $result;
    }
	 
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */