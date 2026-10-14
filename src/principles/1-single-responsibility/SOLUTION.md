# Solution · edit policy is different from data shape

[Exercise](exercise/README.md) · [Lesson](README.md)

Change the name check inside `userValidator.validate` to reject `user.name.trim().length < 2`. Give the error a specific message. Do not change `parseUser`, which accepts existing nonblank names from the source.

Add pure validation tests for blank, one-character, two-character and padded names. Add a hook or component test proving a rejected name never calls `updateUser`. Keep a response fixture with a one-character name and prove it still loads.

The source contract and edit policy are related but independently owned decisions. Making every rule a runtime schema requirement would unintentionally hide existing records when the form policy changes.

This note describes the extension; it is not a second runnable implementation. Names in the fixture use JavaScript string length after trimming. International name policies need deliberate product and Unicode decisions rather than assuming this small exercise is universally appropriate.
