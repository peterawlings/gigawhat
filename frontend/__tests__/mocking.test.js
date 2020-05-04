describe("mocking learning", () => {
  it("mocks a reg function", () => {
    const fetchDogs = jest.fn();
    fetchDogs("pete");
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith("pete");
  });
});
