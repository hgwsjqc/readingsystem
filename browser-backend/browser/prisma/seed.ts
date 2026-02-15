import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始插入数据...');

  // 1. 先插入用户数据
  console.log('插入用户数据...');
  const users = [
    {
      name: 'admin',
      password: 'password123',
      bio: '系统管理员',
    },
    {
      name: 'user1',
      password: 'password123',
      bio: '普通用户',
    },
  ];

  for (const user of users) {
    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { name: user.name },
    });

    if (!existingUser) {
      // 创建新用户
      await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
    } else {
      // 更新现有用户的密码
      await prisma.user.update({
        where: { name: user.name },
        data: {
          password: hashedPassword,
        },
      });
    }
  }

  // 获取用户ID
  const adminUser = await prisma.user.findUnique({
    where: { name: 'admin' },
  });

  if (!adminUser) {
    console.error('用户创建失败');
    return;
  }

  // 2. 插入书籍数据
  console.log('插入书籍数据...');
  const books = [
    {
      title: '程序员修炼之道',
      author: 'Andy Hunt',
      isbn: '9787115166012',
      description: '本书将编程视为一种工艺，介绍了许多实用的编程技巧和最佳实践。',
      publishedAt: new Date('2004-04-01'),
    },
    {
      title: '代码整洁之道',
      author: 'Robert C. Martin',
      isbn: '9787115216878',
      description: '本书详细介绍了如何编写整洁、可维护的代码，是程序员必读的经典之作。',
      publishedAt: new Date('2009-08-01'),
    },
    {
      title: '从0到1',
      author: 'Peter Thiel',
      isbn: '9787508647224',
      description: '硅谷创投教父彼得·蒂尔的创业哲学，教你如何创造价值。',
      publishedAt: new Date('2014-09-01'),
    },
    {
      title: '牛奶与蜂蜜',
      author: 'Rupi Kaur',
      isbn: '9787544288422',
      description: '一本关于爱、失落和成长的诗集，用简洁的诗句触动人心。',
      publishedAt: new Date('2014-11-04'),
    },
    {
      title: 'JavaScript 高级程序设计',
      author: 'Matt Frisbie',
      isbn: '9787115545381',
      description: 'JavaScript 权威指南，全面深入地介绍了 JavaScript 语言的核心概念和高级特性。',
      publishedAt: new Date('2020-09-01'),
    },
    {
      title: '深入浅出 React 和 Redux',
      author: '程墨',
      isbn: '9787115463768',
      description: '系统讲解 React 和 Redux 的原理与实践，帮助开发者掌握现代前端开发技术。',
      publishedAt: new Date('2017-05-01'),
    },
    {
      title: '设计模式：可复用面向对象软件的基础',
      author: 'Erich Gamma',
      isbn: '9787111075752',
      description: '软件设计领域的经典著作，详细介绍了23种设计模式。',
      publishedAt: new Date('2000-09-01'),
    },
    {
      title: '人月神话',
      author: 'Frederick P. Brooks Jr.',
      isbn: '9787302116930',
      description: '软件工程领域的经典之作，深入探讨了软件开发中的管理问题。',
      publishedAt: new Date('1975-01-01'),
    },
    {
      title: '算法导论',
      author: 'Thomas H. Cormen',
      isbn: '9787111407010',
      description: '计算机算法领域的权威教材，全面系统地介绍了算法设计与分析。',
      publishedAt: new Date('2009-07-01'),
    },
    {
      title: '黑客与画家',
      author: 'Paul Graham',
      isbn: '9787115249494',
      description: '硅谷创业教父 Paul Graham 的文集，探讨了编程、创业和艺术的关系。',
      publishedAt: new Date('2011-04-01'),
    },
    {
      title: '重构：改善既有代码的设计',
      author: 'Martin Fowler',
      isbn: '9787115508645',
      description: '软件重构的经典著作，详细介绍了如何改善代码的设计。',
      publishedAt: new Date('2019-03-01'),
    },
    {
      title: '深入理解计算机系统',
      author: 'Randal E. Bryant',
      isbn: '9787111544937',
      description: '从程序员的角度深入理解计算机系统，是计算机科学的经典教材。',
      publishedAt: new Date('2016-11-01'),
    },
    {
      title: '代码大全',
      author: 'Steve McConnell',
      isbn: '9787121022982',
      description: '软件开发的百科全书，涵盖了软件构建的各个方面。',
      publishedAt: new Date('2006-03-01'),
    },
    {
      title: '人件',
      author: 'Tom DeMarco',
      isbn: '9787115259318',
      description: '软件项目管理领域的经典之作，强调人的因素在软件开发中的重要性。',
      publishedAt: new Date('2014-01-01'),
    },
    {
      title: '敏捷软件开发',
      author: 'Robert C. Martin',
      isbn: '9787115249456',
      description: '敏捷开发的经典著作，详细介绍了敏捷软件开发的原则和实践。',
      publishedAt: new Date('2011-08-01'),
    },
    {
      title: 'Head First 设计模式',
      author: 'Eric Freeman',
      isbn: '9787508357393',
      description: '用生动有趣的方式介绍设计模式，是设计模式入门的最佳读物。',
      publishedAt: new Date('2007-09-01'),
    },
    {
      title: '高性能 MySQL',
      author: 'Baron Schwartz',
      isbn: '9787115275386',
      description: 'MySQL 性能优化的权威指南，深入讲解了 MySQL 的内部机制和优化技巧。',
      publishedAt: new Date('2013-05-01'),
    },
    {
      title: 'HTTP 权威指南',
      author: 'David Gourley',
      isbn: '9787115239239',
      description: 'HTTP 协议的权威指南，全面深入地介绍了 HTTP 协议的各个方面。',
      publishedAt: new Date('2012-09-01'),
    },
    {
      title: 'CSS 揭秘',
      author: 'Lea Verou',
      isbn: '9787115417345',
      description: '深入讲解 CSS 的各种技巧和高级特性，帮助开发者掌握 CSS 的精髓。',
      publishedAt: new Date('2016-04-01'),
    },
    {
      title: 'Vue.js 实战',
      author: '梁灏',
      isbn: '9787115474396',
      description: '系统讲解 Vue.js 的原理与实践，帮助开发者快速掌握 Vue.js 开发。',
      publishedAt: new Date('2017-08-01'),
    },
  ];

  for (const book of books) {
    // 检查书籍是否已存在
    const existingBook = await prisma.book.findFirst({
      where: { title: book.title },
    });

    if (!existingBook) {
      await prisma.book.create({
        data: book,
      });
    }
  }

  // 3. 插入文章数据
  console.log('插入文章数据...');
  const posts = [
    {
      title: '如何提高代码质量',
      content: `提高代码质量是每个开发者都应该关注的问题。以下是一些有效的方法：\n\n1. 编写清晰的代码\n   - 使用有意义的变量名和函数名\n   - 保持函数简短，每个函数只做一件事\n   - 使用适当的缩进和格式\n\n2. 遵循编码规范\n   - 选择一种编码风格并始终遵循\n   - 使用工具如 ESLint、Prettier 等自动检查和格式化代码\n\n3. 编写测试\n   - 单元测试可以帮助你发现代码中的问题\n   - 集成测试可以确保系统的各个部分正常工作\n\n4. 代码审查\n   - 定期进行代码审查，发现潜在问题\n   - 学习他人的代码，提高自己的编程水平\n\n5. 持续学习\n   - 关注新技术和最佳实践\n   - 阅读优秀的代码库\n\n通过以上方法，你可以不断提高自己的代码质量，成为一名更好的开发者。`,
      userId: adminUser.id,
    },
    {
      title: '前端开发的未来趋势',
      content: `前端开发领域正在快速发展，以下是一些未来的趋势：\n\n1. 现代化框架\n   - React、Vue、Angular 等框架将继续主导前端开发\n   - 这些框架将不断演进，提供更好的开发体验\n\n2. 服务器端渲染\n   - SSR 和 SSG 将越来越受欢迎，提高首屏加载速度\n   - Next.js、Nuxt.js 等框架将得到更广泛的应用\n\n3. WebAssembly\n   - WebAssembly 将使前端能够处理更复杂的计算\n   - 大型应用将受益于 WebAssembly 的高性能\n\n4. 微前端\n   - 微前端架构将使大型应用的开发和维护更加容易\n   - 团队可以独立开发和部署各自的微前端\n\n5. 无代码/低代码\n   - 无代码/低代码平台将使非专业开发者也能创建前端应用\n   - 专业开发者可以使用这些平台快速原型设计\n\n前端开发的未来充满机遇和挑战，作为开发者，我们需要不断学习和适应这些变化。`,
      userId: adminUser.id,
    },
    {
      title: '后端开发的最佳实践',
      content: `后端开发是构建可靠、高性能应用的关键。以下是一些后端开发的最佳实践：\n\n1. 架构设计\n   - 选择合适的架构模式，如 MVC、微服务等\n   - 合理划分模块，保持代码的可维护性\n\n2. 数据库设计\n   - 设计合理的数据库 schema\n   - 使用索引优化查询性能\n   - 考虑数据库的扩展性\n\n3. API 设计\n   - 遵循 RESTful API 设计原则\n   - 使用适当的 HTTP 方法和状态码\n   - 提供清晰的 API 文档\n\n4. 安全性\n   - 防止 SQL 注入、XSS 等常见攻击\n   - 使用 HTTPS 保护数据传输\n   - 实施适当的认证和授权机制\n\n5. 性能优化\n   - 缓存频繁访问的数据\n   - 优化数据库查询\n   - 使用异步处理提高系统吞吐量\n\n6. 监控和日志\n   - 实施全面的监控系统\n   - 记录详细的日志，便于问题排查\n\n遵循这些最佳实践，你可以构建出更加可靠、高性能的后端系统。`,
      userId: adminUser.id,
    },
    {
      title: 'DevOps 实践指南',
      content: `DevOps 是开发和运维的结合，旨在缩短开发周期，提高交付速度。以下是一些 DevOps 实践：\n\n1. 持续集成 (CI)\n   - 每次代码提交都运行测试\n   - 自动构建和部署\n\n2. 持续部署 (CD)\n   - 自动化部署流程\n   - 快速、安全地将代码部署到生产环境\n\n3. 基础设施即代码 (IaC)\n   - 使用代码管理基础设施\n   - 提高环境的一致性和可重复性\n\n4. 监控和告警\n   - 实时监控系统状态\n   - 及时发现和处理问题\n\n5. 容器化\n   - 使用 Docker 等工具容器化应用\n   - 提高应用的可移植性和可扩展性\n\n6. 编排\n   - 使用 Kubernetes 等工具编排容器\n   - 实现自动扩缩容和负载均衡\n\n通过实施这些 DevOps 实践，团队可以更加高效地交付高质量的软件。`,
      userId: adminUser.id,
    },
    {
      title: '人工智能在软件开发中的应用',
      content: `人工智能正在改变软件开发的方式，以下是一些应用场景：\n\n1. 代码生成\n   - AI 工具如 GitHub Copilot 可以根据注释和上下文生成代码\n   - 提高开发效率，减少重复工作\n\n2. 代码审查\n   - AI 可以帮助发现代码中的潜在问题\n   - 提供代码优化建议\n\n3. 测试\n   - AI 可以自动生成测试用例\n   - 模拟用户行为，发现应用中的问题\n\n4. 文档\n   - AI 可以根据代码自动生成文档\n   - 保持文档与代码的同步\n\n5. 需求分析\n   - AI 可以帮助分析用户需求\n   - 生成需求文档和用户故事\n\n6. 项目管理\n   - AI 可以预测项目进度和风险\n   - 提供项目管理建议\n\n人工智能在软件开发中的应用还处于早期阶段，但它已经开始改变我们的工作方式。随着 AI 技术的不断发展，它将在软件开发中发挥越来越重要的作用。`,
      userId: adminUser.id,
    },
    {
      title: '深入理解 JavaScript 闭包',
      content: `闭包是 JavaScript 中一个重要且强大的概念。理解闭包对于掌握 JavaScript 至关重要。\n\n什么是闭包？\n闭包是指有权访问另一个函数作用域中变量的函数。创建闭包的常见方式，就是在一个函数内部创建另一个函数。\n\n闭包的特点：\n1. 可以访问外部函数的变量\n2. 即使外部函数已经返回，闭包仍然可以访问这些变量\n3. 闭包会将外部函数的变量保存在内存中\n\n闭包的应用场景：\n1. 数据封装和私有化\n   - 使用闭包可以创建私有变量\n   - 避免全局变量污染\n\n2. 函数柯里化\n   - 将多参数函数转换为单参数函数\n   - 提高代码的复用性\n\n3. 事件处理\n   - 在事件处理程序中保存状态\n   - 避免使用全局变量\n\n4. 模块化\n   - 创建模块化的代码结构\n   - 隐藏实现细节\n\n注意事项：\n- 闭包会占用内存，不恰当的使用可能导致内存泄漏\n- 在循环中使用闭包时要特别注意\n\n掌握闭包是成为高级 JavaScript 开发者的必经之路。`,
      userId: adminUser.id,
    },
    {
      title: 'React Hooks 最佳实践',
      content: `React Hooks 改变了我们编写 React 组件的方式。以下是一些最佳实践：\n\n1. 遵循 Hooks 规则\n   - 只在函数组件或自定义 Hook 中调用 Hooks\n   - 只在顶层调用 Hooks，不要在循环、条件或嵌套函数中调用\n\n2. 使用 useEffect 的依赖数组\n   - 正确声明依赖项，避免意外的行为\n   - 使用 ESLint 的 react-hooks/exhaustive-deps 规则\n\n3. 合理使用 useState\n   - 将相关的状态组合在一起\n   - 避免过度使用状态\n\n4. 自定义 Hooks\n   - 将可复用的逻辑提取到自定义 Hook 中\n   - 保持自定义 Hook 的单一职责\n\n5. 性能优化\n   - 使用 useMemo 缓存计算结果\n   - 使用 useCallback 缓存函数引用\n   - 避免不必要的重新渲染\n\n6. 错误处理\n   - 使用 ErrorBoundary 捕获组件错误\n   - 在自定义 Hook 中处理错误\n\n7. 测试\n   - 使用 React Testing Library 测试 Hooks\n   - 编写单元测试和集成测试\n\n遵循这些最佳实践，可以让你编写出更加清晰、高效和可维护的 React 代码。`,
      userId: adminUser.id,
    },
    {
      title: '数据库索引优化指南',
      content: `数据库索引是提高查询性能的关键技术。以下是一些索引优化的最佳实践：\n\n1. 选择合适的索引列\n   - 经常用于 WHERE、JOIN、ORDER BY 的列\n   - 高选择性的列（唯一值多的列）\n   - 避免在低选择性列上创建索引\n\n2. 复合索引的设计\n   - 遵循最左前缀原则\n   - 将最常用的列放在前面\n   - 考虑查询的顺序\n\n3. 索引类型选择\n   - B-Tree 索引：适用于范围查询和等值查询\n   - Hash 索引：适用于等值查询\n   - 全文索引：适用于文本搜索\n   - 空间索引：适用于地理数据\n\n4. 索引维护\n   - 定期分析索引的使用情况\n   - 删除未使用的索引\n   - 重建碎片化的索引\n\n5. 避免索引失效\n   - 避免在索引列上使用函数\n   - 避免使用 LIKE '%xxx' 的模糊查询\n   - 避免隐式类型转换\n\n6. 监控和调优\n   - 使用 EXPLAIN 分析查询计划\n   - 监控慢查询日志\n   - 定期评估索引效果\n\n索引优化是一个持续的过程，需要根据实际的使用情况不断调整和优化。`,
      userId: adminUser.id,
    },
    {
      title: 'TypeScript 高级类型技巧',
      content: `TypeScript 提供了强大的类型系统，掌握高级类型技巧可以让你写出更安全、更灵活的代码。\n\n1. 泛型\n   - 使用泛型编写可复用的组件\n   - 使用泛型约束限制类型范围\n   - 使用条件类型根据条件选择类型\n\n2. 类型推断\n   - 利用 TypeScript 的类型推断减少类型注解\n   - 使用 typeof 获取变量的类型\n   - 使用 keyof 获取对象的所有键\n\n3. 映射类型\n   - 使用 Partial 将所有属性变为可选\n   - 使用 Required 将所有属性变为必需\n   - 使用 Readonly 将所有属性变为只读\n\n4. 条件类型\n   - 使用条件类型根据条件选择类型\n   - 使用 infer 推断类型参数\n   - 使用分布式条件类型处理联合类型\n\n5. 模板字面量类型\n   - 使用模板字面量创建字符串类型\n   - 结合泛型创建动态类型\n\n6. 实用类型\n   - Pick 选择部分属性\n   - Omit 排除部分属性\n   - Record 创建对象类型\n\n掌握这些高级类型技巧，可以让你更好地利用 TypeScript 的类型系统，编写出更加类型安全的代码。`,
      userId: adminUser.id,
    },
    {
      title: '微服务架构设计原则',
      content: `微服务架构将应用拆分为一组小型、独立的服务。以下是一些设计原则：\n\n1. 单一职责原则\n   - 每个服务只负责一个业务功能\n   - 保持服务的简单和专注\n\n2. 服务自治\n   - 每个服务独立部署和扩展\n   - 拥有自己的数据库\n   - 独立开发和维护\n\n3. 去中心化治理\n   - 允许不同的服务使用不同的技术栈\n   - 鼓励团队自主决策\n\n4. 容错设计\n   - 实现断路器模式\n   - 使用重试和超时机制\n   - 实现降级策略\n\n5. 服务通信\n   - 使用 REST 或 GraphQL 进行同步通信\n   - 使用消息队列进行异步通信\n   - 考虑服务网格管理服务间通信\n\n6. 数据一致性\n   - 使用最终一致性模型\n   - 实现分布式事务（如 Saga 模式）\n   - 考虑事件溯源模式\n\n7. 可观测性\n   - 实现集中式日志\n   - 使用分布式追踪\n   - 监控服务的健康状态\n\n微服务架构不是银弹，需要根据项目的实际情况来决定是否采用。`,
      userId: adminUser.id,
    },
    {
      title: '网络安全基础知识',
      content: `网络安全是每个开发者都应该了解的重要话题。以下是一些基础知识：\n\n1. 常见攻击类型\n   - SQL 注入：通过输入恶意 SQL 语句攻击数据库\n   - XSS（跨站脚本攻击）：在网页中注入恶意脚本\n   - CSRF（跨站请求伪造）：伪造用户请求\n   - 点击劫持：诱导用户点击恶意链接\n\n2. 防护措施\n   - 输入验证：验证和过滤所有用户输入\n   - 参数化查询：使用参数化查询防止 SQL 注入\n   - 内容安全策略（CSP）：限制外部资源加载\n   - CSRF Token：防止跨站请求伪造\n\n3. 认证和授权\n   - 使用 HTTPS 保护数据传输\n   - 实施强密码策略\n   - 使用 JWT 或 Session 进行身份验证\n   - 实施基于角色的访问控制\n\n4. 数据保护\n   - 加密敏感数据\n   - 使用安全的存储方式\n   - 定期备份数据\n\n5. 安全最佳实践\n   - 保持系统和依赖更新\n   - 定期进行安全审计\n   - 实施安全开发生命周期（SDLC）\n   - 教育团队成员安全意识\n\n网络安全是一个持续的过程，需要不断学习和更新知识。`,
      userId: adminUser.id,
    },
    {
      title: 'Git 工作流指南',
      content: `Git 是现代软件开发中不可或缺的工具。以下是一些常用的工作流：\n\n1. Git Flow\n   - 主分支（master）：生产环境代码\n   - 开发分支（develop）：开发环境代码\n   - 功能分支（feature）：开发新功能\n   - 发布分支（release）：准备发布\n   - 修复分支（hotfix）：紧急修复\n\n2. GitHub Flow\n   - 主分支（main）：生产环境代码\n   - 功能分支：从 main 创建，完成后通过 PR 合并\n   - 简单直接，适合持续部署\n\n3. GitLab Flow\n   - 主分支（main）：生产环境代码\n   - 环境分支：如 staging、production\n   - 支持环境特定的分支\n\n4. 最佳实践\n   - 频繁提交，保持提交信息清晰\n   - 使用分支隔离开发工作\n   - 进行代码审查（Pull Request）\n   - 保持主分支稳定\n\n5. 常用命令\n   - git clone：克隆仓库\n   - git pull：拉取最新代码\n   - git push：推送代码\n   - git merge：合并分支\n   - git rebase：变基分支\n\n选择适合团队的工作流，并遵循最佳实践，可以提高开发效率和代码质量。`,
      userId: adminUser.id,
    },
    {
      title: 'Docker 容器化入门',
      content: `Docker 是一种容器化技术，可以让应用在任何环境中一致地运行。\n\n1. Docker 核心概念\n   - 镜像（Image）：应用的只读模板\n   - 容器（Container）：镜像的运行实例\n   - 仓库（Repository）：存储和分发镜像\n\n2. Dockerfile 基础\n   - FROM：指定基础镜像\n   - RUN：执行命令\n   - COPY/ADD：复制文件\n   - CMD/ENTRYPOINT：指定启动命令\n\n3. 常用命令\n   - docker build：构建镜像\n   - docker run：运行容器\n   - docker ps：查看运行的容器\n   - docker logs：查看容器日志\n   - docker exec：进入容器\n\n4. 最佳实践\n   - 使用多阶段构建减小镜像大小\n   - 选择合适的基础镜像\n   - 利用缓存层提高构建速度\n   - 使用 .dockerignore 排除不必要的文件\n\n5. Docker Compose\n   - 定义和运行多容器应用\n   - 使用 YAML 文件配置服务\n   - 简化开发和测试环境搭建\n\n6. 生产环境考虑\n   - 使用私有镜像仓库\n   - 实施安全扫描\n   - 监控容器资源使用\n   - 实现日志收集\n\nDocker 已经成为现代应用部署的标准，掌握它对开发者非常重要。`,
      userId: adminUser.id,
    },
    {
      title: 'RESTful API 设计规范',
      content: `RESTful API 是一种流行的 API 设计风格。以下是一些设计规范：\n\n1. 资源命名\n   - 使用名词而非动词\n   - 使用复数形式\n   - 使用层级结构表示关系\n\n2. HTTP 方法\n   - GET：获取资源\n   - POST：创建资源\n   - PUT：更新整个资源\n   - PATCH：部分更新资源\n   - DELETE：删除资源\n\n3. 状态码\n   - 2xx：成功\n   - 3xx：重定向\n   - 4xx：客户端错误\n   - 5xx：服务器错误\n\n4. 版本控制\n   - 在 URL 中包含版本号（如 /api/v1/）\n   - 使用请求头指定版本\n   - 保持向后兼容\n\n5. 分页\n   - 使用 limit 和 offset 参数\n   - 返回总数和分页信息\n   - 提供链接到下一页和上一页\n\n6. 过滤和排序\n   - 使用查询参数实现过滤\n   - 支持多条件过滤\n   - 允许指定排序字段和方向\n\n7. 错误处理\n   - 返回统一的错误格式\n   - 包含错误代码和描述\n   - 提供错误详情和解决方案\n\n8. 安全性\n   - 使用 HTTPS\n   - 实施认证和授权\n   - 防止常见攻击\n\n遵循这些规范，可以设计出清晰、一致和易用的 API。`,
      userId: adminUser.id,
    },
    {
      title: 'Node.js 性能优化技巧',
      content: `Node.js 是一个高性能的 JavaScript 运行时。以下是一些性能优化技巧：\n\n1. 异步编程\n   - 使用 async/await 替代回调\n   - 避免阻塞事件循环\n   - 使用 Promise.all 并行执行异步操作\n\n2. 内存管理\n   - 避免内存泄漏\n   - 及时释放不再使用的对象\n   - 使用内存分析工具监控内存使用\n\n3. 缓存策略\n   - 使用内存缓存（如 Redis）\n   - 实现多级缓存\n   - 设置合理的缓存过期时间\n\n4. 数据库优化\n   - 使用连接池\n   - 优化查询语句\n   - 使用索引提高查询性能\n\n5. 流式处理\n   - 使用 Stream 处理大文件\n   - 避免一次性加载所有数据\n   - 使用管道（pipe）连接流\n\n6. 集群模式\n   - 使用 Node.js 集群模块\n   - 充分利用多核 CPU\n   - 实现负载均衡\n\n7. 压缩和编码\n   - 使用 gzip 压缩响应\n   - 使用更高效的编码（如 Protobuf）\n   - 减少数据传输量\n\n8. 监控和调优\n   - 使用性能监控工具\n   - 分析慢日志\n   - 定期进行性能测试\n\n性能优化是一个持续的过程，需要根据实际情况不断调整和优化。`,
      userId: adminUser.id,
    },
    {
      title: 'CSS Grid 布局完全指南',
      content: `CSS Grid 是一个强大的二维布局系统，可以轻松创建复杂的布局。\n\n1. 基本概念\n   - Grid 容器：display: grid\n   - Grid 项目：容器的直接子元素\n   - Grid 线：分割网格的线\n   - Grid 轨道：两条相邻线之间的空间\n\n2. 定义网格\n   - grid-template-columns：定义列\n   - grid-template-rows：定义行\n   - grid-template-areas：使用命名区域\n\n3. 放置项目\n   - grid-column：指定列位置\n   - grid-row：指定行位置\n   - grid-area：指定区域\n\n4. 对齐和间距\n   - justify-items：水平对齐项目\n   - align-items：垂直对齐项目\n   - gap：设置间距\n\n5. 响应式设计\n   - 使用 minmax() 函数\n   - 使用 auto-fit 和 auto-fill\n   - 结合媒体查询\n\n6. 实用技巧\n   - 使用 fr 单位分配空间\n   - 使用 repeat() 函数简化代码\n   - 使用 subgrid 创建子网格\n\n7. 浏览器支持\n   - 现代浏览器都支持 Grid\n   - 使用 @supports 检测支持\n   - 提供降级方案\n\nCSS Grid 让布局变得简单而强大，是现代前端开发的重要工具。`,
      userId: adminUser.id,
    },
    {
      title: 'Webpack 配置优化指南',
      content: `Webpack 是一个强大的模块打包工具。以下是一些配置优化技巧：\n\n1. 构建速度优化\n   - 使用 cache-loader 缓存加载结果\n   - 使用 thread-loader 多线程处理\n   - 使用 DLL 预编译不常变化的依赖\n\n2. 代码分割\n   - 使用 SplitChunksPlugin 分割代码\n   - 使用动态 import() 懒加载\n   - 提取公共代码\n\n3. Tree Shaking\n   - 使用 ES6 模块语法\n   - 配置 sideEffects\n   - 移除未使用的代码\n\n4. 压缩和优化\n   - 使用 TerserPlugin 压缩代码\n   - 使用 CSSNano 优化 CSS\n   - 启用生产模式\n\n5. 资源优化\n   - 使用 url-loader 处理小文件\n   - 使用 image-webpack-loader 压缩图片\n   - 使用字体子集化\n\n6. 环境变量\n   - 使用 DefinePlugin 定义环境变量\n   - 使用 .env 文件管理配置\n   - 区分开发和生产环境\n\n7. 性能分析\n   - 使用 webpack-bundle-analyzer 分析包大小\n   - 使用 speed-measure-webpack-plugin 测量构建时间\n   - 持续优化配置\n\n8. 最佳实践\n   - 保持配置简洁\n   - 使用预设配置（如 webpack-merge）\n   - 定期更新依赖\n\nWebpack 配置优化可以显著提高开发体验和构建性能。`,
      userId: adminUser.id,
    },
    {
      title: '软件设计模式详解',
      content: `设计模式是解决常见软件设计问题的可复用解决方案。\n\n1. 创建型模式\n   - 单例模式：确保只有一个实例\n   - 工厂方法模式：由子类决定实例化哪个类\n   - 抽象工厂模式：创建相关对象的家族\n   - 建造者模式：分步骤创建复杂对象\n   - 原型模式：通过克隆创建对象\n\n2. 结构型模式\n   - 适配器模式：使不兼容的接口协同工作\n   - 桥接模式：将抽象与实现分离\n   - 组合模式：组合对象形成树形结构\n   - 装饰器模式：动态添加功能\n   - 外观模式：简化复杂接口\n   - 享元模式：共享对象减少内存\n   - 代理模式：控制对对象的访问\n\n3. 行为型模式\n   - 策略模式：定义算法族，可以互换\n   - 观察者模式：对象间一对多依赖\n   - 命令模式：将请求封装为对象\n   - 模板方法模式：定义算法骨架\n   - 迭代器模式：遍历集合\n   - 中介者模式：减少对象间耦合\n   - 备忘录模式：保存和恢复状态\n   - 解释器模式：解释语言语法\n   - 责任链模式：传递请求直到被处理\n   - 状态模式：对象行为随状态改变\n   - 访问者模式：在不修改类的情况下添加操作\n\n掌握设计模式可以提高代码的可维护性和可扩展性。`,
      userId: adminUser.id,
    },
  ];

  for (const post of posts) {
    // 检查文章是否已存在
    const existingPost = await prisma.post.findFirst({
      where: { title: post.title },
    });

    if (!existingPost) {
      await prisma.post.create({
        data: post,
      });
    }
  }

  // 4. 统计数据
  const userCount = await prisma.user.count();
  const bookCount = await prisma.book.count();
  const postCount = await prisma.post.count();

  console.log('\n数据插入完成！');
  console.log(`统计结果：`);
  console.log(`用户数量：${userCount}`);
  console.log(`书籍数量：${bookCount}`);
  console.log(`文章数量：${postCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });