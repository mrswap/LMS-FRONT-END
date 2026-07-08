const txtStart = shapeGroup.indexOf("{\\shptxt");
if (txtStart === -1) {
  // No text in this shape at all -> this is Word's divider/rule
  // shape, not a heading. Record it so we can restore the actual
  // divider line right before whichever heading follows it,
  // instead of losing it.
  dividerMarkers.push({
    paragraphIndex: shapeParagraphIndex.has(shpStart)
      ? shapeParagraphIndex.get(shpStart)
      : rtfOrder,
    rtfOrder: rtfOrder++,
    used: false,
  });
  continue;
}
