<template>
 <div class="app-container">
      <div class="filter-container">
         <router-link :to="{name:'CreateClassify'}">
          <el-button type="primary"  style="margin-left: 10px;"  plain>添加分类</el-button>
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

     <el-table-column label="排序" align="center" width="80">
       <template slot-scope="{row}">
         <span>{{ row.sort}}</span>
       </template>
     </el-table-column>
     <el-table-column label="标题" align="center" width="120">
       <template slot-scope="{row}">
         <span>{{ row.title}}</span>
       </template>
     </el-table-column>
     <el-table-column label="图标" align="center" width="100px">
       <template slot-scope="{row}">
            <img :src="imgUrl+row.icon_url" alt="" width="80px">
       </template>
     </el-table-column>
     <el-table-column label="主图" align="center" width="260px">
       <template slot-scope="{row}">
            <img :src="imgUrl+row.img_url" alt="" width="250px">
       </template>
     </el-table-column>

     <el-table-column label="背景图" align="center" width="260px">
       <template slot-scope="{row}">
          <img :src="imgUrl+row.bg_url" alt="" width="250px">
       </template>
     </el-table-column>
     
     <el-table-column label="状态" align="center">
       <template slot-scope="{row}">
         <span>{{ row.status ==1 ? '已开启':'已关闭' }}</span>
       </template>
     </el-table-column>
     
     <el-table-column label="创建时间" align="center">
       <template slot-scope="{row}">
         <span>{{ row.created_at }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}">
        <router-link :to="'edit/'+row.id">
          <el-button type="primary" size="mini" style="margin-right: 5px;">
            编辑
          </el-button>
        </router-link>
<!--         <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
           删除
         </el-button> -->
       </template>
     </el-table-column>
   </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
</div>
</template>

<script>
   import { classifyList  } from '@/api/classify'
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
          username: undefined,
        },
        temp: {
          id: undefined,
          name: '',
        },
        dialogPvVisible: false,
        dialogFormVisible: false,
        dialogStatus: '',
        pvData: [],
        textMap: {
          update: '编辑',
          create: 'Create'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        var str=process.env.VUE_APP_BASE_API;
        var  leg= str.indexOf('api');
        var url= str.substr(0,leg);
        this.imgUrl= url+'/';
        classifyList(this.listQuery).then(response => {
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


/*      handleDelete(index, row) {

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBanner(index.id).then(response => {
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

      } */
    }
  }
</script>
