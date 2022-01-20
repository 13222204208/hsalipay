<template>
  <div class="app-container">
     <router-link :to="{name:'CreateAgreement'}">
      <el-button type="primary" plain>添加协议</el-button>
      </router-link>
   <el-table
     :key="tableKey"
    :data="tableData"
    v-loading="listLoading"
     border
     fit
     highlight-current-row
     style="width: 100%;margin-top: 10px;"
   >
     <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" >
       <template slot-scope="{row}">
         <span>{{ row.id }}</span>
       </template>
     </el-table-column>

     <el-table-column label="协议标题" align="center">
       <template slot-scope="{row}">
         <span>{{ row.title}}</span>
       </template>
     </el-table-column>
     <el-table-column label="协议类型" align="center">
       <template slot-scope="{row}">
         <span>{{ row.recytype.title}}回收需知</span>
       </template>
     </el-table-column>

     <el-table-column label="创建时间" align="center">
       <template slot-scope="{row}">
         <span>{{ row.created_at }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}">
         <router-link :to="'edit/'+row.id">
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
 </div>
</template>

<script>
   import { agreementList, delAgreement } from '@/api/agreement'
  export default {
    data() {
      return {
        tableKey: 0,
        tableData:null,
        listLoading: true,
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(){
        this.listLoading = true
        agreementList().then( response=>{
          this.tableData = response.data;

          this.listLoading = false

        })
      },
      handleDelete(index, row) {
        console.log(index, row);
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAgreement(index.id).then(response => {
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
            message: '删除失败'
          });
        });

      }
    }
  }
</script>
