#引言
在iOS、Android、PC Web产品开发中，有个步骤基础且重要——切图和适配。在有钱项目开发中，我们参考了诸多流行的切图和适配方案，总结了一套自己的流程和规范。下面以网易有钱iOS的开发过程为例，介绍下我们的方法。
#切图工具
切图工具五花八门，比较有代表的是Photoshop+ PxCook +Cutterman 等Photoshop配合[Photoshop配合标记工具、导出工具](http://www.jianshu.com/p/83af310f5939)的方式；另外一种就是Mac上的Sketch+plugins即Sketch配合标记工具、导出工具。下面以Sketch+Sketch Measure+Sketch Export Generator 为例。 
#切图需求
传统的切图工作是由视觉设计师来完成的，提供assets（切图文件夹）的同时还提供了measurement（视觉标注 ）供开发使用（[详见参考链接](http://www.ui.cn/detail/57717.html)）这种方式在我们以前也有使用，但这种方案是有弊端的：

1. 项目成员里通常是1个视觉搭配1个iOS开发+1个Android开发+1个PC Web\H5 开发，如果是视觉来做切图（多份适配图）+标记，不仅视觉的工作量太大，而且分工饱和度不匹配。如果加上后期需求变更，视觉的工作会暴增，视觉同学不堪重负
2. 开发逻辑和视觉逻辑不一致。开发往往会因为切的图和自己实现的思路不一致，而需要进行二次加工或者使用workround的方案，非常别扭。如果开发不会切图，可能需要视觉回炉重新切。在我们过往开发过程中明显地感觉到：如果是从JS转为专职做页面架构的同学，他们提供的html的文件结构层级、切图等让前端开发用起来很舒服——html结构的层级是匹配实现逻辑的；相反如果是个本行就写页面架构的同学提供给前端开发的稿子，很少会有这样的优势。

在有钱项目开始不久，我们决定对传统的方式做以下调整：

1. 视觉只需要出规范、Sketch源文件、关键标记，不需要切图
2. 开发自行切图，具体元素具体标记

这样视觉同学只需要修改Sketch源文件，直接传导给开发同学，开发同学拿到源文件，查看标记+切图。以后需求变更，视觉也只需要改Sketch源文件和重要标记（大部分是不需要的），就可以直接传导给开发重新切图——之间衔接比较流畅。能够实施这套方案，也得益于Sketch的完善和视觉与开发之间的交流深入。

1. Sketch比起Photoshop更适合移动端（[Sketch vs Photoshop](http://www.webdesignerdepot.com/2015/03/infographic-sketch-vs-photoshop/ 'Infographic: Sketch vs Photoshop')）。PhotoShop在标记方面、导出1x2x3xPDF等方面缺乏支持，还有其臃肿的体积、蜗牛般缓慢的打开速度、贪婪的吃内存等问题非常影响使用体验。让开发在切图、看标记的时候，不得不在PhotoShop、标记工具、插件之间切换，额外消耗精力；相反Sketch内置切图、标记功能，开发人员非常容易上手。
2. 同时视觉同学也从开发这边得到了一些反馈，了解了一些常用的界面的实现原理和逻辑，反馈到视觉设计阶段，作为设计规范和设计原则并遵守。这让视觉和开发对界面布局逻辑有了些许共识，衔接更加顺畅。

下面按照工作流的方式分别说明每一步的规则和规范、同时列一些有钱中的实例，方便读者理解。
###第一步——确定视觉规范和基础约定
这部分规范和约定对应传统的Spec文件夹的东西。包括但不限于以下：

1. 约定项目需要的字体字号规范。
比如，把普通字符颜色和字号分别定义为```MK_COLOR_TEXT_NORMAL```和```MK_SIZE_FONT_NORMAL```，分别对应```0x555555,16f```。
事实上这只是基础规范。如果考虑到对iPhone和iPad的版本适配，我们后面有了编号的设计，这个编号代表了字号和颜色。不同的设备下字号是经过适配的，调用者不需要了解具体数值，如`[MKStyleUtil standardLabelStyle:baseInfo withCode:MKFontStyleCode_067]`；能编号也得益于Sketch的TextStyle功能，在Sketch实现中，叫SharedTextStyle，精确的表达了其作为规范化的工具的用途。
<p style="text-align:center">
![](https://dn-lemon18.qbox.me/images/ui-adaption/1d0ca12b-a420-4be9-8141-b69f1cecd914.png)
<br/>图1. 视觉规范，图示为编号为67的TextStyle</p>
2. 约定基础原则。这些原则是开发是否能够在后期快速、准确、高效切图，实现视觉到app转换的关键。如：
<ol type="A">
  <li>约定Sktech开发以Rendered Pixels的尺寸来做，如750X1334，而不是375X667。缺点是，Sketch在导出的时候，尺寸是偏大一倍的。图2是自动生成的导出选项，偏大，图3是正确的导出选项，需要手动调整。
<p style="text-align:center">
![](https://dn-lemon18.qbox.me/images/ui-adaption/e6237713-633d-4d3b-9939-f1345e7c0119.png)
<br/>图2. 错误的，大一倍的导出选项</p>
<p style="text-align:center">
![](https://dn-lemon18.qbox.me/images/ui-adaption/20801bd6-2ea5-46e2-bd68-c5c99223163a.png)
<br/>图3. 正确的，导出合适图片的选项</p>
</li>
  <li>所有元素的尺寸必须为偶数。  
这个约定可以有效避免当元素位置为奇数的时候出现毛边或者锯齿。具体原因是，图片元素在渲染时，元素边界不在物理像素边界上时，该元素会拉伸或者移动到物理像素边界。长宽是奇数X偶数的图片，如果旋转转90度或270度，也容易出现锯齿。</li>
  <li>字符元素不要有padding，他的高宽应该完全是字符本身的字体和字号来自动撑开的。<br/>
这个规范的需求来自于，当需要确定字符和父元素或者兄弟元素间距的时候，使用`option+click`显示的尺寸数值或者安装measure插件之后`ctrl+shift+3`出现的尺寸数值，可以直接在代码中使用。
<p style="text-align:center">
![](https://dn-lemon18.qbox.me/images/ui-adaption/b10582dc-e042-415e-a7c5-d3316d3f984e.png)
<br/>图4. Sketch Measure插件测量元素尺寸和边距的示意</p>
</li>
<li>良好的分组。  
如果视觉的设计是边框+阴影+中间的小树是一个整体，那么视觉应该将这些元素作为一个分组。分组不仅让视觉在设计的时候可以作为一个整体复用，也方便开发快速切图——开发只需要选择边框，就能选择所需的元素。这里还有个特殊情况，如果视觉实现的效果是用自己特殊的字体字号设计的，视觉会使用Sketch的Text on Path 技术，将其转化为一个图片。这样开发不需要安装这种字号也可以显示出来，非常棒。良好的分组在使用measure插件的时候，`control+shift+3`也会生成合适的边距。
</li>
<li>基础约定中的多态变化。 
按钮会有normal，disabled， selected，highlighted等状态。视觉和开发约定：文字的disabled是normal的0.5透明；一组元素的disabled是normal的0.2透明。这个0.2透明通常是一个背景颜色为#000000的视图元素覆盖到一组元素的上面，实现disabled效果。   
图5中，如左图是正常状态，右图是在左图的基础上加了一个0.2透明的黑色图层。下图还示例了一个有旋转的图层，切图的时候，有以下原则：如果不涉及到动态旋转，在切图的时候就切出带旋转的图片，目的是避免运行时进行旋转计算，消耗性能。有了disabled的约定，很多按钮和图层的样式都不需要视觉出disabled的效果（实际中还是有例外）。有了基础的约定，减少视觉和开发的沟通时间，在效果上也保持整个App的一致性。切图的第一原则：能不切就不切。
<p style="text-align:center">
![](https://dn-lemon18.qbox.me/images/ui-adaption/c3c6fede-9854-4cb0-ab8b-a8e7481b0217.png)
<br/>图5. 一组元素的normal和disabled效果对比</p>
</li>
<li>组件之间，一定要有规则的对齐方式。  
左对齐、右对齐、居中、垂直居中、顶部对齐、底部对齐。组件之间的间距可以是任意数值，但组件和屏幕的边距应该是一致的，如30px。
</li>
</ol>

###第二步——视觉和开发的协作
在以前的旧项目开发流程中，为了减少沟通的摩擦，我们把视觉、交互、开发等资料都引入了一个叫一览query的工程里，打包为一个web服务，在内网使用。这个工程里包括axure交互稿的html版本、视觉稿PSD文件、开发中使用的第三方接口（txt文件，word文件），还有项目组的项目列表和对应负责人一览。交互将导出的html上传到query服务器，生成一个链接，其他人只需要访问这个链接就可以看到最新的交互稿，而且是实时的，不会出现交互和开发看到两个不同版本的问题。

以前是视觉做出一个效果，分别导出PNG和PSD，PNG作为给产品和QA等的参考，PNG的文件由视觉以iCloud里图片共享的方式，供QA、产品使用，PSD文件以点对点的（邮件或者POPO）方式给开发。后期使用过有道云协作共享PSD。到了Sketch时期，我们又使用了百度网盘共享的方式。百度网盘+Sketch 文件，协作起来容易的多，一是百度网盘可设置为自动同步，没必要每次都手动去sync，二是Sketch文件不大，传送速度也很快。

但是，Sketch里一个Page包含了若干的artBoard，这些artBoard分属不同模块，所以是大家一起共享这个文件。这时候一定要关闭Sketch的 autoSave功能，不然一定会出现一个视觉文件的多个backup都在网盘的情况。

所以最佳实践是百度网盘+sketch without Auto Save + iCloud的图片共享。

说到视觉和开发的协作衔接问题，不得不称赞Sketch Measure插件提供的Spec export功能。它的理念：视觉面对Sketch源文件，而其它人（iOS，Android，PC Web，产品，QA）直接面对Spec export导出的html文件。既然是html文件，自然可以跨平台，带来的优势是——只有视觉需要购买Sketch软件，其它人都只需要浏览器。开发可以在export的html文件里除了可以查看视觉效果外，还可以看元素的尺寸和间距、元素文字内容、radius、填充色等，还可以导出图片。这意味着什么？一个iOS开发完全可以拿HTML文件代替Sketch，因为开发需要的东西都可以在html文件里找到。又可以引入到我们的query系统，提供在线预览功能，是不是很棒——B/S 模式的精髓！
<p style="text-align:center">
<img style="width:480px;height:380px" src="https://dn-lemon18.qbox.me/images/ui-adaption/f32d1987-fe06-4f98-9fac-86abdb4b0003.png"/>
<br/>图6 Sketch Measure插件的导出效果图</p>

这是理想状态。   
现实中，受限于视觉分组的逻辑和开发逻辑的不一致（分组影响导出的html里可以导出那些图片），大部分的间距标记其实对开发是无用的。当业务功能较多时，视觉的工作量会变得很重，所以目前Measure插件还没用起来。但是如果是简单项目，完全可以达到这种效果——优雅而高效。如果是PCWeb项目，用Sketch的另外一个插件marketch 效果更好。Sketch Measure插件在导出的时候，只能选择当前选中的artBoard，所以如果需要传导给开发全部的artBoard，是很麻烦的。我们在Sketch Measure的基础上增加了导出选项（当前选中、当页、所有），同时优化了导出页面的左侧导航交互，增加了显示文字的StyleName的功能，这就是插件[Sketch Measure Plus](https://github.com/hite/sketch-measure-plus)。

###第三步——开发切图需知和技巧

\>\>&nbsp;&nbsp;&nbsp;尺寸的确定，0padding+margin。  
宁愿写magic number的margin值也要保持0padding。具体体现在文字上，如果是单行文字，设定padding=0，margin可采用居中或者和兄弟组件之间的距离为某个具体值 ；而图片呢，则切不包含空白边缘的图标 。

\>\>&nbsp;&nbsp;&nbsp;预处理视觉稿  
增加容器。视觉稿中有一些相同的东西并排显示,在视觉设计时，可能不会有容器，但代码实现层面，会用循环来输出这些元素，所以最好的方式是放到一个容器里，这样方便整体定位和更新（如removeAllSubview)等。预先判断各个元素的相对定位关系：如按照父容器定位、和兄弟节点定位、居中对齐等；确定定位关系，除了要考虑各元素之间位置有动态变化的情况外，还需要和视觉设计师沟通不同情况下的显示原则，如高度变高后，是所有元素之间的间距平分还是只是撑高某一个间距。

\>\>&nbsp;&nbsp;&nbsp;从开发的角度看视觉元素  
基本处理元素为图片、文字、容器。开发在拿到视觉稿时，第一时间关注到元素的设计要点，在编写代码的时候注意处理，这样一次run、build就能高度还原视觉稿，省去大量重复run、build时间。
看到图片，关注点：

1. 是否有圆角，是否需要切图切位圆角（一般切图包含圆角）
2. 是否有边框，是否要切图切边框（一般切图中包含边框）
3. 是否半透明
4. 图片和四周的关系（固定边距或者居中）

而看到文字，关注点：

1. 字体颜色、字号、字体粗细（font-weight）
2. 在容器中的对齐方式（居中，居左，居右）
3. 是否半透明
4. 图片和四周的关系（固定边距或者居中）
5. 多行文字还需要注意行距

关于容器，关注点较少：

1. 是否圆角。
2. 是否边框
3. 容器高宽是否自适应。
4. 背景色
5. 补白（这个很重要也容易被忽略）

举例说明拿到视觉稿，如何将其分解为一个个小组件，用代码实现。  
下图的图分别是理财指南的三种不同情况的视觉稿。当有红包的时候，中间位置被撑开，下半部分向下移；在iPhone5以下中显示，警告文字是两行。
<p style="text-align:center">
<img style="width:400px;height:300px" src="https://dn-lemon18.qbox.me/images/ui-adaption/ba963a6e-b2b6-4919-9360-6a68538f9666.png"/>
<br/>图7没有红包信息， ‘苹果公司……’的什么没有换行</p>
<p style="text-align:center">
<img style="width:400px;height:300px" src="https://dn-lemon18.qbox.me/images/ui-adaption/fc26c892-f5e0-4cc1-a23a-242401954008.png"/>
<br/>图8 有红包信息， ‘苹果公司……’的什么没有换行。</p>
<p style="text-align:center">
<img style="width:400px;height:300px" src="https://dn-lemon18.qbox.me/images/ui-adaption/b76cc904-2d30-4541-a380-2bb607603230.png"/>
<br/>图9 没有红包信息， ‘苹果公司……’的有换行（实际上是iPhone4、5的情况）。</p>

分析一下各个元素的之间的关系。不同的人对各个元素的层次划分，归属关系是不一样的，步骤：

1. 确定元素个体。分解如下，如果是没有红包则显示编号3‘的文本元素，有红包则显示编号3的文本元素：
<p style="text-align:center">
<img style="width:480px;height:380px" src="https://dn-lemon18.qbox.me/images/ui-adaption/4f27abe1-3e7d-437a-b3aa-c664053aab5a.png"/>
<br/>图10 元素分解图，4是自行添加的元素，用来管理3个产品的容器。</p>
2. 确定元素的范围。  
注意按照上面的原则，每个元素的尺寸都只包含自己，没有padding。其中3个产品外面的绿色框图（即元素4）是为了代码实现时方便定位需要的容器，视觉稿里是没有的。所以有了以下的区域划分：
<p style="text-align:center">
<img style="width:480px;height:380px" src="https://dn-lemon18.qbox.me/images/ui-adaption/f2dc87fb-1525-41ca-a2f9-f169504685ea.png"/>
<br/>图11 各个元素区域划分图</p>
3. 确定元素的边界之后需要确定元素的定位  
分析到会有没红包和有红包两种显示效果，差别在于整个cell的高度。元素1、2保持对容器顶部对齐，元素8保持对容器底部对齐；元素9是一类元素，和视觉沟通之后 ，定位原则是：左右和屏幕之间的距离固定，元素之间的间隔相同（之所以没有说固定的值是因为后面有iPhone5，iPhone6，iPhone6P，iPad等端适配）。而元素5、6、7是9的子元素，其中5顶部和9对齐，6顶部对齐5的底部并偏移，7顶部对齐6的底部并偏移。所以有了以下尺寸标识：
<p style="text-align:center">
<img style="width:480px;height:380px" src="https://dn-lemon18.qbox.me/images/ui-adaption/de2bb7ee-6000-4c8f-bedb-e975c5847730.png"/>
<br/>图12  元素定位图，边距。</p>

图示中，没有标识横向约束的，表明横向宽度和父容器等宽，居中对齐或者左对齐。如元素5、6、7是和父容器等宽；8和父容器横向有30px的margin等。

可能其他人会有这样的分组。 将1、2、3作为一组，让他们有一个父容器10， 让容器10、4，8作为兄弟节点，并且10、4、8元素依次向下布局。这样带来的问题是，如果有红包信息，需要撑开高度，那么需要修改容器10的高度，同时为了向下移动的部分能够显示完整，还需要修改Cell的高度。而目前图示的分组（没有包装1、2、3为容器10，并且4、8向下对齐），带来的好处是只需要修改cell的高度，就可以实现视觉所示效果。

###第四步，适配
有了素材有了尺寸，下一步是代码实现，你必须面对一个问题，适配。  
如果你还没有感受到适配是个大问题，那么这个大图会让你改变想法。[点击这里查看大图](http://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions)
<p style="text-align:center">
<img src="https://dn-lemon18.qbox.me/images/ui-adaption/879992b9-44be-45f6-a40e-31332d19aaee.png"/>
<br/>图13 iPhone尺寸大全</p>

从视觉稿到一个可拿在手上触摸的APP，需要处理（iOS7+iOS8+iOS9）\*（iPhone4/5+iPhone6+iPhone6P+iPad）种情况（虽然真正需要处理并没有这么多）。基本适配方案如下：

1. 文字字号大小，以iPhone6为准，iPhone5=iPhone6， iPhone6P = iPhone6*1.5，特殊地方特殊处理
图片元素。素材，使用1x2x3x作为对应设备使用的图片；尺寸，在不同的设备里有不同的尺寸，图片相应等比缩放。
2. 对齐和间距。 尽量居中对齐，规范间距（如所有的tableView的cell高度是一致的，只有两种高度），总结起来说，固定不动项，自适应空白。
3. 不适配。典型的，所有元素和屏幕的边距固定为30px，颜色不适配。

说到图片的适配，这里需要说一下PDF格式的assets，据说可以只切一份PDF的图片而不需要3份。从xcode6开始支持以1x的尺寸切出PDF矢量图，xCode在complie的时候，生成对应的1x2x3x的PNG图片。 经过我们测试结果发现，毛刺严重，而且这篇文章 [Why I don’t use PDFs for iOS assets](https://bjango.com/articles/idontusepdfs/)也印证了目前不适合用pdf来代替1x2x3x的图片的结论。在查阅了一些资料之后，还发现一些其他限制:

1. pdf的图，不能使用slicing（显而易见）
2. SVG或PDF矢量格式的资源,这种方式要额外消耗手机的计算资源，特别是在界面跳转时有转场动效的情况下（未验证）

所以我们还在使用sketch export 来导出3份PNG图，如果读者有更好的方案，欢迎和我们分享，[邮件交流](mailto:moneykeeper_iosdev@mail.netease.com)

代码层面适配是如何实现的呢？
<ol type="1">
<li>文字字号在不同的设备下有不同的大小。所以我们为某种类型的字体，设置编号。如图示中的字体被编号为64，这个编号约定了字体和字号（不包含对齐方式）。
<p style="text-align:center">
<img src="https://dn-lemon18.qbox.me/images/ui-adaption/2e188002-a7bf-4703-8453-39bb34a82c90.png"/>
<br/>图14 Sketch里的TextStyle，用于编号</p>
它代表了这个文字字号的编号是64，颜色编号是64。实际上字体编号64不是一个固定的值：

```objective-c
	/**
	 *  根据不同的屏幕宽度获取适配的尺寸
	 */
	#define MKGetUniversalSizeByWidth(for320, for375, for414, for768) [MKMacroUtil getUniversalSizeByWidth:for320 f375:for375 f414:for414 f768:for768]
	...
	case MKFontStyleCode_064:
	styleModel.font = [MKFont commonFont:MKGetUniversalSizeByWidth(15.0f, 15.0f, 18.0f, 15.0f)];
	styleModel.color = UIColorFromRGB(MK_COLOR_GRAY_55);
	break;
```
可见字体适配，而颜色不适配。

实际编码中，如下所示，就可以完成适配。

```objective-c
	UILabel *subject = [[UILabel alloc] init];
	subject.text = [option objectForKey:@"text"];
	subject.textAlignment = NSTextAlignmentCenter;
	[MKStyleUtil standardLabelStyle:subject withCode:MKFontStyleCode_064];
	[cellView addSubview:subject];
```
</li>
<li>容器的尺寸和边距。
下图分别是iPhone5、iPhone6、iPhone6P 视觉提供的适配图， 适用大部分适配的原则，标记只列出了几个关键的地方。
注意：每个答案文字元素始终是水平、垂直居中对齐的。
<p style="text-align:center">
<img style="width:500px;height:680px" src="https://dn-lemon18.qbox.me/images/ui-adaption/0E5A780B-0021-4C9D-80EF-45814331375E.png"/>
<br/>图15 iPhone4、5的适配效果。图中标出了边距、一个问题行的高度，跳过按钮的尺寸。</p>
<p style="text-align:center">
<img style="width:500px;height:680px" src="https://dn-lemon18.qbox.me/images/ui-adaption/510E45A6-9F0B-4DB1-AB63-4AFFF2588D00.png"/>
<br/>图16 iPhone6的适配效果</p>
<p style="text-align:center">
<img style="width:520px;height:640px" src="https://dn-lemon18.qbox.me/images/ui-adaption/FC7FCB4B-D8CD-4FD6-8CCE-8B0FFEFB81A3.png"/>
<br/>图17 iPhone6P的适配，可见问答卡片到屏幕的边距已经不是45px了，而是特殊的102px</p>

看到这么多尺寸，是不是有种要哭的冲动？不过有了masonry和StyleUtil，写起来容易得多。以整个问答卡片的定位为例，关键代码如下：

```objective-c
const CGFloat PADDING = MKGetUniversalSizeByWidth(30/2.0f, 30/2.0f, 102/3.0f, 30/2.0f);
[slider mas_makeConstraints:^(MASConstraintMaker *make) {
      make.right.mas_equalTo(-PADDING);
      make.left.mas_equalTo(PADDING);
      make.top.mas_equalTo(MKGetUniversalSizeByWidth(180/2.0f, 228/2.0f, 340/3.0f, 180/2.0f));
      make.height.mas_equalTo([self slideHeight]);
}];

- (CGFloat)slideHeight{
    return MKGetUniversalSizeByWidth(852/2.0f, 852/2.0f, 1372/3.0f,852/2.0f);
}
```
</li>
</ul>

适配是个复杂的工程，即使有了所谓的规范，也不能覆盖所有的场景。有些很重要的场景还是需要一个像素一个像素的调整，终究是个体力活。

说完了我们最核心的方法之后，为了保持文章的完整性，列出切图时命名规则：
**模块名-页面名-图片种类-图片名字_状态（如果有）破折号-表示分组，下划线_表示状态,最长破折号不要超过5个，如果还有很多子功能，可以使用驼峰模式。**

譬如，投资模块-股票列表页面-头部的背景。命名  
`invest-stock-bg-tableheader`

当总体股票是赚钱的时候，是红色的背景，如果亏损则是绿色，命名：
`invest-stock-bg-tableheader_green`  
`invest-stock-bg-tableheader_red`

买入按钮的图片，正常和disabled状态的命名：  
`invest-stock-ico-buy`  
`invest-stock-ico-buy_disabled`

公共使用的图片，如查看更多，命名：  
`ico-viewMore`

###最后一步，走查
如果严格的做好上面的工作，做出100% 和视觉matching的APP已经不是梦。然而，然而，人都是有惰性的。可能你记得量了一个块级元素的上下间距适配，却忘记了左右边距适配。

所以为了克服人性的弱点，我们在项目开发的瀑布图中加了一环——视觉交互走查。
大概的形式是视觉和开发一对一坐在一起，视觉一个界面一个界面地看，那里不对那里要改，这时候不仅改开发不符合视觉的地方，也改视觉当时没有考虑好的地方。这个阶段有时候很耗时。如果是传统的native开发，大部分是按照iPhone5走查，改动完毕之后再依次安装到iPhone6、iPhone6P、iPad，看效果。但是后期部分功能采用了react-native的模式，可以做到修改之后，各个设备分别摇一摇就能看效果——做到了多端并行走查，提高了效率。

做完了这些步骤，通过测试之后，一个香喷喷的APP就可以deliver到用户手上了，👍！

###结尾
在追求如何优雅高效地切图和适配的探索上，我们才刚刚起步，有些地方还不尽完善。切图时需要手动改导出选项的问题，还在让我们头疼（Sketch export to xcode的change base dentist 不能设置0.5）；Sketch的measure插件在测量边距时，还是不能正确地寻找到它的兄弟元素（手动`option+mouse over`是可以的）；在开发native代码时，多种设备适配走查，效率还是很低（react-native没有全部替换native）；对于iPad端适配，视觉同学苦不堪言——还不如专门为iPad设计一套——怎么适配都很丑（在示例代码中，你可以看到大部分iPad是按照iPhone5来适配的）。

我们希望看到有更好的方案来做适配这种体力活，解放我们的眼睛，解放我们的双手。
对于以上内容，如果存在谬误或者有更好的方法，欢迎读者朋友和我们[邮件交流](mailto:moneykeeper_iosdev@mail.netease.com)。

###参考
1. https://www.designernews.co/stories/46380-sketch-vs-photoshop-for-ui--ux-design 对比才有看头！SKETCH秒杀PS CC 2015新功能的7个地方
2. https://www.zhihu.com/question/27495264 Sketch 有哪些插件值得推荐？杀
4. http://antinomy.me/2014_07_16_186/ 移动APP图标设计建议和技巧
7. http://www.shejipai.cn/app-cut-plan.html  APP切图的那点事——安卓与iOS平台切图小结
8. http://www.shejidaren.com/image-slice-for-ios-apps.html  iOS APP UI设计之从效果图到UI切图
9. http://www.ui.cn/detail/48165.html 進擊腾讯の浩男（二）
10. https://www.zhihu.com/question/25370620 Xcode 6 可以使用 PDF 格式的矢量图作为图片资源，自动适配？
13. http://youxiputao.tw/articles/3145 iPhone 6/6 Plus 出現後，如何實現一份設計稿支持多個尺寸？