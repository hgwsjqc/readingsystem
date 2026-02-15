import Mock from 'mockjs'
const tabs=["热点", "职场", "副业", "理财", "情感", "成长", "学习", "读书",
  "旅行", "美食", "健身", "摄影", "影视", "音乐", "AI", "数码",
  "家居", "育儿", "心理", "创业"]
const posts=Mock.mock({
    'list|45':[//list 45 条
        {
            title:'@ctitle(8,20)',
            brief:'@ctitle(20,100)',
            totalComments:'@integer(0,30)',
            totalLikes:'@integer(0,500)',
            publishedAt:'datetime(yyyy-MM-dd HH:mm:ss)',
            user:{
                id:'@integer(1,100)',
                name:'@cname(2,4)',
                avatar:'@image(300x200)'
            },
            tags:()=>Mock.Random.pick(tabs,2),
            thumbnail:'@image(300x200)',
            pics:[
                '@image(300x200)',
                '@image(300x200)',
                '@image(300x200)',
            ],
            id:'@increment(1)'
        }
    ]
}).list
export default [
    {
        url:'/api/posts',
        method:'get',
        response:({query},res)=>{
            console.log(query,"???");
            const {page='1',limit='10'}=query;
            const currentPage=parseInt(page,10);
            const size=parseInt(limit,10);

            if(isNaN(currentPage)||isNaN(size)||currentPage<1||size<1){
                return{
                    code:400,
                    msg:'page and limit must be number',
                    data:null
                }
            }
            const total=posts.length;//count
            const start=(currentPage-1)*size;//
            const end=start+size;
            const pageinatedData=posts.slice(start,end);

            return{
                code:200,
                msg:'success',
                items:pageinatedData,
                pagination:{
                    current:currentPage,
                    limit:size,
                    total,
                    totalPage:Math.ceil(total/size)
                }
            }
        }
    }
]