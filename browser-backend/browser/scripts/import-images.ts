import { PrismaClient, File } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importImages() {
  console.log('开始导入图片...');

  // 获取uploads文件夹中的所有图片
  const uploadsDir = path.join(__dirname, '../uploads');
  const files = fs.readdirSync(uploadsDir).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
  );

  // 获取admin用户ID
  const adminUser = await prisma.user.findUnique({
    where: { name: 'admin' }
  });

  if (!adminUser) {
    console.error('未找到admin用户');
    return;
  }

  const userId = adminUser.id;

  // 导入图片到files表
  const importedFiles: File[] = [];
  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    
    // 检查文件是否已存在
    const existingFile = await prisma.file.findFirst({
      where: { filename: file }
    });

    if (!existingFile) {
      const newFile = await prisma.file.create({
        data: {
          originalname: file,
          filename: file,
          mimetype: `image/${path.extname(file).slice(1)}`,
          size: stats.size,
          width: 800,
          height: 600,
          userId: userId
        }
      });
      importedFiles.push(newFile);
      console.log(`导入图片: ${file}`);
    } else {
      importedFiles.push(existingFile);
      console.log(`图片已存在: ${file}`);
    }
  }

  // 获取所有文章
  const posts = await prisma.post.findMany();
  
  // 为文章关联图片
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const file = importedFiles[i % importedFiles.length];
    
    await prisma.file.update({
      where: { id: file.id },
      data: { postId: post.id }
    });
    
    console.log(`为文章 "${post.title}" 关联图片: ${file.filename}`);
  }

  // 获取所有书籍
  const books = await prisma.book.findMany();
  
  // 为书籍关联封面图片
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const file = importedFiles[(i + posts.length) % importedFiles.length];
    
    await prisma.file.update({
      where: { id: file.id },
      data: { bookId: book.id }
    });
    
    await prisma.book.update({
      where: { id: book.id },
      data: { coverFileId: file.id }
    });
    
    console.log(`为书籍 "${book.title}" 关联封面: ${file.filename}`);
  }

  console.log('图片导入完成！');
  console.log(`共导入 ${importedFiles.length} 张图片`);
  console.log(`关联了 ${posts.length} 篇文章`);
  console.log(`关联了 ${books.length} 本书籍`);

  await prisma.$disconnect();
}

importImages().catch(console.error);
