V1 mixin
@include responsive(
  display, small block, medium table, large none;
  font-size, small 14px, medium 20px, large 40px;
);

V2 mixin
@include responsive(
  display, small block; - medium, large - initial value, if not defined it should be inherit
  font-size, small medium 14px, large 40px; - bp combination
);
