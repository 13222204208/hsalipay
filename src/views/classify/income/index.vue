<template>
 <div class="app-container">
      <div class="filter-container">

          <el-select v-model="listQuery.classify_id" placeholder="请选择分类" style="width: 200px; left: 10px;" >
            <el-option v-for='item in option' :key='item.id' :value='item.id' :label='item.title'>  			</el-option>
          </el-select>


        <el-button v-waves class="filter-item" type="primary" style="margin-left: 15px;" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>

         <router-link :to="{name:'CreateIncome'}">
          <el-button type="primary"  style="margin-left: 10px;"  plain>添加收益</el-button>
          </router-link>

      </div>
      <br>
   <el-table
     :key="tableKey"
    :data="tableData"
    v-loading="listLoading"
     border
     fit
     highlight-current-row
     style="width: 100%;"
   >
     <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" >
       <template slot-scope="{row}">
         <span>{{ row.id }}</span>
       </template>
     </el-table-column>

     <el-table-column label="排序" align="center" width="50">
       <template slot-scope="{row}">
         <span>{{ row.sort}}</span>
       </template>
     </el-table-column>
     <el-table-column label="所属分类" align="center">
       <template slot-scope="{row}">
         <span>{{ row.classify.title }}</span>
       </template>
     </el-table-column>
     <el-table-column label="重量范围" align="center">
       <template slot-scope="{row}">
         <span>{{ row.weight }}</span>
       </template>
     </el-table-column>


     <el-table-column label="预计收益" align="center">
       <template slot-scope="{row}">
         <span>{{ row.price }} 元</span>
       </template>
     </el-table-column>


     <el-table-column label="备注" align="center">
       <template slot-scope="{row}">
         <span>{{ row.remark }} </span>
       </template>
     </el-table-column>

     <el-table-column label="创建时间" align="center">
       <template slot-scope="{row}">
         <span>{{ row.created_at }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}">
        <router-link :to="'income/edit/'+row.id">
          <el-button type="primary" size="mini" style="margin-right: 5px;">
            编辑
          </el-button>
        </router-link>
         <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
           删除
         </el-button>
       </template>
     </el-table-column>
   </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
</div>
</template>

<script>
   import { incomeList , delIncome } from '@/api/income'
   import { showClassify  } from '@/api/classify'
   import waves from '@/directive/waves' // waves directive
   import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
     directives: { waves },
    data() {
      return {
        tableKey: 0,
        tableData:null,
        listLoading: true,
        imgUrl:'',
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          classify_id: undefined
        },
        temp: {
          id: undefined,
          name: '',
        },
        dialogPvVisible: false,
        dialogFormVisible: false,
        dialogStatus: '',
        pvData: [],
        option:[],
        textMap: {
          update: '编辑',
          create: 'Create'
        },
      }
    },
    created() {
      this.getList()
      this.getClassify()
    },
    methods: {

      getClassify() {
        showClassify().then( response=>{
          console.log('商品分类',response)
          this.option = response.data;

        })
      },

      getList() {
        this.listLoading = true
        var str=process.env.VUE_APP_BASE_API;
        var  leg= str.indexOf('api');
        var url= str.substr(0,leg);
        this.imgUrl= url+'/';
        incomeList(this.listQuery).then(response => {
          this.tableData = response.data.item;
          this.total = response.data.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },


      handleDelete(index, row) {

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delIncome(index.id).then(response => {
          this.$notify({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.tableData.splice(row, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }
</script>
