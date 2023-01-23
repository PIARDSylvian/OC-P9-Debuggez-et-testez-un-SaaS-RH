/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"
import router from "../app/Router"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      const html = NewBillUI()
      document.body.innerHTML = html
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
    })

    afterEach(() => {
      document.body.innerHTML = '';
    })

    test("Then I submit a empty form", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(datepicker.validity.valid).toBeFalsy();
    })
    test("Then I submit a form with only date", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      datepicker.value = "2023-01-06"
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeFalsy()
    })
    test("Then I submit a form with valid date and amount", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeFalsy()
    })
    test("Then I submit a form with valid date, amount and pct", () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      const file = screen.getByTestId('file')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      pct.value = "10"
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeTruthy()
      expect(file.files.length).toBe(0);
    })
    test("Then I submit a form with valid date, amount pct and bad extentions file", async () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      const file = screen.getByTestId('file')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      pct.value = "10"

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener("change", handleChangeFile)

      const event = {
        target: {
          files: [{
            name: 'image.pdf',
            size: 50000,
            type: 'application/pdf',
          },]
        },
      }
      fireEvent.change(file, event)
      
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeTruthy()
      expect(file.files.length).toBe(0);
    })
    test("Then I submit a form with valid date, amount pct and right extentions file", async () => {
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname })}
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      const file = screen.getByTestId('file')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      pct.value = "10"

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener("change", handleChangeFile)

      const event = {
        target: {
          files: [{
            name: 'image.png',
            size: 50000,
            type: 'image/png',
          },]
        },
      }
      fireEvent.change(file, event)
      
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      expect(datepicker.validity.valid).toBeTruthy()
      expect(amount.validity.valid).toBeTruthy()
      expect(pct.validity.valid).toBeTruthy()
      expect(file.files.length).toBe(1);
      expect(file.files[0].name).toBe('image.png');
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to NewBills", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      console.error = jest.fn()
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("bills from mock API POST with name of bill : new bill", async () => {
      let list = [];
      mockStore.bills.mockImplementation(() => {
        return {
          update : (newBill) => { return new Promise(() => {
            const data = JSON.parse(newBill.data)
            list.push({...data})
          })},
          list : () => { return Promise.resolve(list)},
          create : () =>  { return new Promise(() => {
            return {fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'}
          })},
        }
      })
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByText("Envoyer une note de frais"))
      const form = screen.getByTestId('form-new-bill')
      const name = screen.getByTestId('expense-name')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const pct = screen.getByTestId('pct')
      const file = screen.getByTestId('file')
      datepicker.value = "2023-01-06"
      amount.value = "100"
      pct.value = "10"
      name.value = "new bill"
      const event = {
        target: {
          files: [{
            name: 'image.png',
            size: 50000,
            type: 'image/png',
          },]
        },
      }
      fireEvent.change(file, event)
      fireEvent.submit(form)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const createBills = screen.getByText('new bill')
      expect(createBills).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
      test("bills from an API and fails with 404 message error", async () => {
        let list = [];
        mockStore.bills.mockImplementation(() => {
          return {
            list : () => { return Promise.resolve(list)},
            create : () =>  { return Promise.reject(new Error("Erreur 404"))},
            update : () =>  { return Promise.reject(new Error("Erreur 404"))}
          }
        })
        window.onNavigate(ROUTES_PATH.NewBill)
        await waitFor(() => screen.getByText("Envoyer une note de frais"))
        const form = screen.getByTestId('form-new-bill')
        const name = screen.getByTestId('expense-name')
        const datepicker = screen.getByTestId('datepicker')
        const amount = screen.getByTestId('amount')
        const pct = screen.getByTestId('pct')
        const file = screen.getByTestId('file')
        datepicker.value = "2023-01-06"
        amount.value = "100"
        pct.value = "10"
        name.value = "new bill"
        const event = {
          target: {
            files: [{
              name: 'image.png',
              size: 50000,
              type: 'image/png',
            },]
          },
        }
        fireEvent.change(file, event)
        fireEvent.submit(form)
        await new Promise(process.nextTick);
        expect(console.error).toHaveBeenCalledWith(new Error("Erreur 404"));
      })
      test("bills from an API and fails with 500 message error", async () => {
        let list = [];
        mockStore.bills.mockImplementation(() => {
          return {
            list : () => { return Promise.resolve(list)},
            create : () =>  { return Promise.reject(new Error("Erreur 500"))},
            update : () =>  { return Promise.reject(new Error("Erreur 500"))}
          }
        })
        window.onNavigate(ROUTES_PATH.NewBill)
        await waitFor(() => screen.getByText("Envoyer une note de frais"))
        const form = screen.getByTestId('form-new-bill')
        const name = screen.getByTestId('expense-name')
        const datepicker = screen.getByTestId('datepicker')
        const amount = screen.getByTestId('amount')
        const pct = screen.getByTestId('pct')
        const file = screen.getByTestId('file')
        datepicker.value = "2023-01-06"
        amount.value = "100"
        pct.value = "10"
        name.value = "new bill"
        const event = {
          target: {
            files: [{
              name: 'image.png',
              size: 50000,
              type: 'image/png',
            },]
          },
        }
        fireEvent.change(file, event)
        fireEvent.submit(form)
        await new Promise(process.nextTick);
        expect(console.error).toHaveBeenCalledWith(new Error("Erreur 500"));
      })
    })
  })
})