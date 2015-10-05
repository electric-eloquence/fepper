<div class="page" id="page">
	<!-- Begin .header -->
<header class="header cf" role="banner">
	<a href=""><img src="../../images/logo.png" class="logo" alt="Logo Alt Text" /></a>
<a href="#" class="nav-toggle nav-toggle-search icon-search"><span class="is-vishidden">Search</span></a>
	<a href="#" class="nav-toggle nav-toggle-menu icon-menu"><span class="is-vishidden">Menu</span></a>
<?php print $page['primary_nav']; ?>
	<?php print $page['search']; ?>
</header>
<!-- End .header -->

	<div role="main">
<?php if ($emergency): ?>
			<?php print $alert; ?>
		<?php endif; ?>
		<?php if ($hero): ?>
			<?php print $hero; ?>
		<?php endif; ?>

		<div class="g g-3up">
			<?php foreach ($touts as $tout): ?>
				<div class="gi">
					<?php print $tout; ?>
				</div>
			<?php endforeach; ?>
		</div><!--end 3up-->

		<hr />

		<div class="l-two-col">
			<div class="l-main">
				<section class="section latest-posts">
					<h2 class="section-title">Latest Posts</h2>
					<ul class="post-list">
						<?php foreach ($latest_posts as $post): ?>
							<li><?php print $post; ?></li>
						</ul>
					<a href="#" class="text-btn">View more posts</a>
				</section>
			</div><!--end .l-main-->

			<div class="l-sidebar">
				<?php print $page['related_posts']; ?>
				<?php print $page['recent_tweets']; ?>
			</div><!--end l-sidebar-->
		</div><!--end l-two-col-->
	</div><!--End role=main-->
	<?php print $page['footer']; ?>
</div>
