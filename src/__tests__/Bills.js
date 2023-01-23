/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import router from "../app/Router.js"
import Bills from "../containers/Bills.js"

jest.mock("../app/store", () => mockStore)

describe("Bills unit tests", () => {
  it("Should be return date error", async () => {
    const wrongBills = { bills : () => {
      return { list : () => { return Promise.resolve([ {"date":"2022 22 11"} ])}}
    }}
    const bills = new Bills({document, store: wrongBills});
    const formatedBills = await bills.getBills();
    expect(formatedBills[0].date).toBe("2022 22 11");
  })

  it("Should be return bills list", async () => {
    const bills = new Bills({document, store: mockStore});
    const formatedBills = await bills.getBills();
    expect(formatedBills.length).toBe(4)
  })

  it("Should be return Undefined", async () => {
    const bills = new Bills({document, store: null});
    const formatedBills = await bills.getBills();
    console.log(formatedBills)
    expect(formatedBills).toBeUndefined();
  })
})

describe("Bills Integration Test Suites", () => {
  it("Should be return Undefined", async () => {
    const bills = new Bills({document, store: null});
    const formatedBills = await bills.getBills();
    console.log(formatedBills)
    expect(formatedBills).toBeUndefined();
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("On click on btn-new-bill it should be redirect to new bills page", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const billsContainer = new Bills({
        document, onNavigate, store: bills, localStorage: window.localStorage
      })
      const newBillButton = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(billsContainer.handleClickNewBill)
      newBillButton.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillButton)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByTestId(`form-new-bill`)).toBeTruthy()
    })

    test("On click on icon-eye it should be open modal", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
      const billsContainer = new Bills({
        document, onNavigate, store: bills, localStorage: window.localStorage
      })
      const eye = screen.getAllByTestId('icon-eye')[0]
      $.fn.modal = jest.fn(); //for jQuery
      const handleClickIconEye = jest.fn((e) => billsContainer.handleClickIconEye(e.target))
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)

      expect(handleClickIconEye).toHaveBeenCalled()
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const contentPending  = await screen.getByText("encore")
      expect(contentPending).toBeTruthy()
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  })
})
