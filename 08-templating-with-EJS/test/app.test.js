process.env.PORT = 3001;
const server = require("../app");
const puppeteer = require("puppeteer");

describe("To-Do List App", () => {
  let browser;
  let page;
  const gotoPage = `http://localhost:${process.env.PORT}`;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "headless",
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.close();
  });

  it("should add a 2 tasks and display it in the response", async () => {
    await page.goto(gotoPage);

    const task1ToAdd = "First task";
    await new Promise((r) => setTimeout(r, 500));
    await page.type("input[name=task]", task1ToAdd);
    await page.click(".add-button");

    const task2ToAdd = "Second task";
    await new Promise((r) => setTimeout(r, 500));
    await page.type("input[name=task]", task2ToAdd);
    await page.click(".add-button");

    const task1Span = await page.waitForSelector("#taskText0", {
      timeout: 1000,
    });

    const task2Span = await page.waitForSelector("#taskText1", {
      timeout: 1000,
    });
    const task1Text = await task1Span.evaluate(
      (element) => element.textContent
    );
    const task2Text = await task2Span.evaluate(
      (element) => element.textContent
    );
    // cleanup
    await page.click(".delete-button");

    await new Promise((r) => setTimeout(r, 500));
    await page.click(".delete-button");

    expect(task1Text).toContain(task1ToAdd);
    expect(task2Text).toContain(task2ToAdd);
  });

  it("add a 2 tasks and delete the first - only the second should be in the response", async () => {
    await page.goto(gotoPage);
    await new Promise((r) => setTimeout(r, 500));

    const task1ToAdd = "First task";
    await page.type("input[name=task]", task1ToAdd);
    await page.click(".add-button");

    const task2ToAdd = "Second task";
    await new Promise((r) => setTimeout(r, 500));
    await page.type("input[name=task]", task2ToAdd);
    await page.click(".add-button");
    await new Promise((r) => setTimeout(r, 500));
    await page.click(".delete-button:first-of-type");
    const taskSpan = await page.waitForSelector("#taskText0", {
      timeout: 1000,
    });

    try {
      await page.waitForSelector("#taskText1", {
        timeout: 1000,
      });
      fail("'#taskText1' item should be deleted");
    } catch (error) {
      console.log(error.message);
      if (!error.message.includes("selector `#taskText1`")) throw error;
    }
    const taskText = await taskSpan.evaluate((element) => element.textContent);

    // cleanup
    await page.click(".delete-button");

    expect(taskText).toContain(task2ToAdd);
  });

  it("should add a 2 tasks and mark as done second, it should be striken out", async () => {
    await page.goto(gotoPage);

    const task1ToAdd = "First task";
    await page.type("input[name=task]", task1ToAdd);
    await page.click(".add-button");

    const task2ToAdd = "Second task";
    await new Promise((r) => setTimeout(r, 500));
    await page.type("input[name=task]", task2ToAdd);
    await page.click(".add-button");
    await new Promise((r) => setTimeout(r, 500));
    await page.type("input[name=task]", task2ToAdd);
    //check second task
    await page.click(`.task-list-container:nth-child(2) input`);
    let task1Span = await page.waitForSelector("#taskText0", {
      timeout: 1000,
    });
    let task2Span = await page.waitForSelector("#taskText1.done", {
      timeout: 1000,
    });
    await page.reload();
    await new Promise((r) => setTimeout(r, 500));

    task1Span = await page.waitForSelector("#taskText0", {
      timeout: 1000,
    });
    task2Span = await page.waitForSelector("#taskText1.done", {
      timeout: 1000,
    });
    const task1Text = await task1Span.evaluate(
      (element) => element.textContent
    );
    const task2Text = await task2Span.evaluate(
      (element) => element.textContent
    );
    // cleanup
    await page.click(".delete-button");
    await new Promise((r) => setTimeout(r, 500));
    await page.click(".delete-button");

    expect(task1Text).toContain(task1ToAdd);
    expect(task2Text).toContain(task2ToAdd);
  });

  it("should add a 2 tasks and mark as done second, then add one more task, the second should be striken out", async () => {
    await page.goto(gotoPage);

    const task1ToAdd = "First task";
    await page.type("input[name=task]", task1ToAdd);
    await page.click(".add-button");

    await new Promise((r) => setTimeout(r, 500));
    const task2ToAdd = "Second task";
    await page.type("input[name=task]", task2ToAdd);
    await page.click(".add-button");

    await new Promise((r) => setTimeout(r, 500));
    await page.type("input[name=task]", task2ToAdd);
    //check second task
    await new Promise((r) => setTimeout(r, 500));
    await page.click(`.task-list-container:nth-child(2) input`);
    let task1Span = await page.waitForSelector("#taskText0", {
      timeout: 1000,
    });
    let task2Span = await page.waitForSelector("#taskText1.done", {
      timeout: 1000,
    });
    await page.reload();
    
    await new Promise((r) => setTimeout(r, 500));
    const task3ToAdd = "Third task";
    await page.type("input[name=task]", task3ToAdd);
    await page.click(".add-button");

    task1Span = await page.waitForSelector("#taskText0", {
      timeout: 1000,
    });
    task2Span = await page.waitForSelector("#taskText1.done", {
      timeout: 1000,
    });
    const task1Text = await task1Span.evaluate(
      (element) => element.textContent
    );
    const task2Text = await task2Span.evaluate(
      (element) => element.textContent
    );
    // cleanup
    await page.click(".delete-button");
    await new Promise((r) => setTimeout(r, 500));
    await page.click(".delete-button");
    await new Promise((r) => setTimeout(r, 500));
    await page.click(".delete-button");

    expect(task1Text).toContain(task1ToAdd);
    expect(task2Text).toContain(task2ToAdd);
  });
  
  it("should remove done status after unchecking", async () => {
    await page.goto(gotoPage);

    const task1ToAdd = "First task";
    await page.type("input[name=task]", task1ToAdd);
    await page.click(".add-button");

    await new Promise((r) => setTimeout(r, 500));
    const task2ToAdd = "Second task";
    await page.type("input[name=task]", task2ToAdd);
    await page.click(".add-button");

    await new Promise((r) => setTimeout(r, 500));
    await page.type("input[name=task]", task2ToAdd);
    //check second task
    await new Promise((r) => setTimeout(r, 500));
    await page.click(`.task-list-container:nth-child(2) input`);
    await new Promise((r) => setTimeout(r, 500));
    await page.reload();
    await new Promise((r) => setTimeout(r, 500));
    await page.click(`.task-list-container:nth-child(2) input`);
    await new Promise((r) => setTimeout(r, 500));
    await page.reload();
    await new Promise((r) => setTimeout(r, 500));
    let task1Span = await page.waitForSelector("#taskText0", {
      timeout: 1000,
    });
    let task2Span = await page.waitForSelector("#taskText1", {
      timeout: 1000,
    }); 

    const task1Text = await task1Span.evaluate(
      (element) => element.textContent
    );
    const task2Text = await task2Span.evaluate(
      (element) => element.textContent
    );
    // cleanup
    await page.click(".delete-button");
    await new Promise((r) => setTimeout(r, 500));
    await page.click(".delete-button");

    expect(task1Text).toContain(task1ToAdd);
    expect(task2Text).toContain(task2ToAdd);
  });
});
