module.exports = `import $ComponentName$ from "../index";
import { shallow } from "enzyme";
import React from 'react';
describe("$ComponentName$", () => {
  it("should render correctly", () => {
    let $ComponentName$Snapshot = shallow(<$ComponentName$/>);
    expect($ComponentName$Snapshot).toMatchSnapshot();
  });
});`;
