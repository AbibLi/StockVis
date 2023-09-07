<template>
  <div class="common-layout">
    <el-container>
      <el-header id="header">
        <ParallelTatal></ParallelTatal>
      </el-header>
      <el-container>
        <el-main id="lmain">
          <Calendar></Calendar>
        </el-main>
        <el-main id="rmain">
          <el-container>
            <el-aside id="cmenue">
              <ul>
                <li>
                  <RouterLink to="/Home/BasicBar"><el-button type="primary" round size='large' style="width: 100px;">Bar
                      Chart</el-button>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/Home/BasicPie"><el-button type="success" round size='large' style="width: 100px;">Pie
                      Chart</el-button>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/Home/Sunburst"><el-button type="danger" round size='large'
                      style="width: 100px;">Sunburst</el-button>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/Home/GridView"><el-button type="warning" round size='large'
                      style="width: 100px;">Table</el-button>
                  </RouterLink>
                </li>
              </ul>
            </el-aside>
            <el-main id="ccontent">
              <router-view></router-view>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import ParallelTatal from '../components/ParallelTotal.vue'
import Calendar from '../components/Calendar.vue'
</script>

<style scoped>
#header {
  height: 720px;
}

#lmain {
  width: 38%;
  height: 750px;
}

#rmain {
  width: 50%;
  padding-left: 5px;
}

el-button {
  width: 50px;
  size: 'large';
}

#cmenue {
  width: 100px;
  height: 600px;
}

li {
  margin-top: 20px;
}
</style>
