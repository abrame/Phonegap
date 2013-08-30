var data = {};
data.vars =
  [
    { name: "T_name", type: CPUtils.Type.text },
    { name: "T_number", type: CPUtils.Type.text },
    { name: "T_nothing", type: CPUtils.Type.text },
    { name: "T_address", type: CPUtils.Type.text },
    { name: "T_aaron", type: CPUtils.Type.text },
    { name: "N_age", type: CPUtils.Type.number },
    { name: "N_awesomeness", type: CPUtils.Type.number },
    { name: "N_number", type: CPUtils.Type.number },
    { name: "N_nothing", type: CPUtils.Type.number },
    { name: "N_something", type: CPUtils.Type.number },
    { name: "B_myBool", type: CPUtils.Type.boolean },
    { name: "B_myFavoriteBool", type: CPUtils.Type.boolean },
    { name: "B_bob", type: CPUtils.Type.boolean },
    { name: "B_bacon", type: CPUtils.Type.boolean },
    { name: "B_maybe", type: CPUtils.Type.boolean }
  ];

data.fields =
  [
    { fieldType: CPUtils.Type.record, parentObjectName: "My record", name: "Username is aaronb", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.record, parentObjectName: "My record", name: "Stuff and more stuff", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.record, parentObjectName: "My record", name: "Password is password", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.record, parentObjectName: "My record", name: "bacon and eggs", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.record, parentObjectName: "My record", name: "I like bacon", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.record, parentObjectName: "My other record", name: "I like milk", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.record, parentObjectName: "My other record", name: "I like starcraft", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.record, parentObjectName: "My other record", name: "I like pokemon", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.search, parentObjectName: "My search", name: "Username", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.search, parentObjectName: "My search", name: "DOB", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.search, parentObjectName: "My search", name: "Height", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.search, parentObjectName: "My search 2", name: "Weight", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.search, parentObjectName: "My search 2", name: "Age", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.pi, parentObjectName: "My pi", name: "Name", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.pi, parentObjectName: "My pi", name: "Date", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.pi, parentObjectName: "My pi", name: "More Stuff", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.pi, parentObjectName: "My pi 2", name: "Running out of ideas", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.pi, parentObjectName: "My pi 2", name: "idk", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.po, parentObjectName: "My po", name: "Output", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.po, parentObjectName: "My po", name: "November Rain", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.po, parentObjectName: "My po", name: "I'm currently", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.po, parentObjectName: "My po 2", name: "Listening to", type: CPUtils.Type.text },
    { fieldType: CPUtils.Type.po, parentObjectName: "My po 2", name: "Pandora on my phone", type: CPUtils.Type.text }
  ];

data.instrs =
  [
    {
      name: "LoadRecord", desc: "Receives a table name and a primary field value and returns the record from the table with primary field value", returnType: CPUtils.Type.record,
      params: [
        { name: "Table", desc: "The table to load the record from", type: CPUtils.Type.string },
        { name: "Primary key", desc: "The primary key value", type: CPUtils.Type.text }
      ]
    },
    {
      name: "CreateRecord", desc: "Receives a table name and creates a new record in that table", returnType: CPUtils.Type.record,
      params: [
        { name: "Table", desc: "The table to create the new record in", type: CPUtils.Type.string }
      ]
    },
    {
      name: "SaveRecord", desc: "Saves a record", returnType: CPUtils.Type.none,
      params: [
        { name: "Record", desc: "The record to save", type: CPUtils.Type.record }
      ]
    },
    {
      name: "DeleteRecord", desc: "Deletes a record", returnType: CPUtils.Type.none,
      params: [
        { name: "Record", desc: "The record to delete", type: CPUtils.Type.record }
      ]
    },
    {
      name: "CompareText", desc: "Determines whether text is the same or contains another piece of text.", returnType: CPUtils.Type.boolean,
      params: [
        { name: "Left", desc: "The left side", type: CPUtils.Type.text },
        { name: "Operator", desc: "The comparison operator", type: ["Equals", "Contains"] },
        { name: "Right", desc: "The right side", type: CPUtils.Type.text }
      ]
    }
  ];

$(document).ready(function () {
  CPUtils.initialize("editor", null, null, "themes", "suggestions", "instructions", data);

  $(document).keydown(function (objEvent) {
    if (objEvent.ctrlKey) {
      if (objEvent.keyCode == 68) {
        CPAuto.removeObjectFields(CPUtils.Type.record, "My other record");
        // do stuff
        return false;
      }
    }
  });
});